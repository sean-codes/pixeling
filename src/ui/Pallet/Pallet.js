class Pallet {
   constructor(options) {
      this.mixer = options.mixer
      this.onChangeColor = options.onChangeColor
      this.onChangeSize = options.onChangeSize
      this.tempSize = 1
      this.size = 1

      this.colors = [
         { h: 0, s: 0, l: 0, a: 1 },
         { h: 0, s: 0, l: 25, a: 1 },
         { h: 0, s: 0, l: 50, a: 1 },
         { h: 0, s: 0, l: 75, a: 1 },
         { h: 0, s: 60, l: 60, a: 1 },
         { h: 25, s: 60, l: 60, a: 1 },
         { h: 50, s: 60, l: 60, a: 1 },
         { h: 75, s: 60, l: 60, a: 1 },
         { h: 100, s: 60, l: 60, a: 1 },
         { h: 125, s: 60, l: 60, a: 1 },
         { h: 150, s: 60, l: 60, a: 1 },
         { h: 175, s: 60, l: 60, a: 1 },
         { h: 200, s: 60, l: 60, a: 1 },
         { h: 225, s: 60, l: 60, a: 1 },
         { h: 250, s: 60, l: 60, a: 1 },
         { h: 275, s: 60, l: 60, a: 1 },
         { h: 300, s: 60, l: 60, a: 1 },
         { h: 325, s: 60, l: 60, a: 1 },
         { h: 350, s: 60, l: 60, a: 1 },
      ]
      this.selected = this.colors.length - 1
      this.color = this.colors[this.selected]
      this.htmlCreate()
   }

   eventClickColor(e, element) {
      this.setActiveColorElement(element)
   }

   eventBrushSizeScroll(e, element) {
      this.tempSize += e.deltaY/10
      this.brushSizeChanged()
   }

   eventIncreaseBrushSize(e, element) {
      this.tempSize += 1
      this.brushSizeChanged()
   }

   eventDecreaseBrushSize(e, element) {
      this.size -= 1
      this.brushSizeChanged()
   }

   brushSizeChanged() {
      this.tempSize = Math.min(20, Math.max(1, this.tempSize))
      this.size = Math.round(this.tempSize)
      this.htmlBrushSize.innerHTML = Math.round(this.size)
      this.onChangeSize(this.size)
   }

   setActiveColorElement(element) {
      for(var colorElement of this.htmlColors) {
         colorElement.classList.remove('active')
      }

      element.classList.add('active')
      this.html.active = element
      this.selected = element.dataset.colorID
      this.setColor(this.colors[element.dataset.colorID])
   }

   setColor(color) {
      this.color = color
      this.colors[this.selected] = color
      var stringColor = this.hslaToString(color)

      this.htmlColor.style.background = stringColor
      this.html.active.style.background = stringColor
      this.html.active.dataset.color = stringColor
      this.mixer.setColor(color)
      this.onChangeColor(this.color)
   }

   getColor() {
      return JSON.parse(JSON.stringify(this.colors[this.selected]))
   }

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   }

   htmlCreate() {
      var htmlColorsRecipe = [
         {
            classes: ['pallet', 'container'],
            children: [
               {
                  classes: ['brush'],
                  events: {
                     wheel: this.eventBrushSizeScroll.bind(this)
                  },
                  children: [
                     {
                        classes: ['control'],
                        innerHTML: '<',
                        events: {
                           click: this.eventDecreaseBrushSize.bind(this)
                        }
                     },
                     { classes: ['size'], innerHTML: '1' },
                     {
                        classes: ['control'],
                        innerHTML: '>',
                        events: {
                           click: this.eventIncreaseBrushSize.bind(this)
                        }
                     }
                  ]
               },
               {
                  classes: ['colors'],
                  children: this.colors.map((color, id) => {
                     return {
                        classes: ['color'],
                        data: { colorID: id },
                        styles: {
                           background: this.hslaToString(this.colors[id])
                        },
                        events: {
                           click: this.eventClickColor.bind(this)
                        }
                     }
                  })
               },
               {
                  tag: 'div',
                  classes: ['mixer'],
                  styles: {
                     background: this.color
                  },
                  append: [ this.mixer.html.chooser ]
               }
            ]
         }
      ]

      var bakedHTML = app.bakeHTML(htmlColorsRecipe)

      this.html = bakedHTML.first()
      this.htmlBrushSize = this.html.children[0].children[1]
      this.htmlColors = this.html.children[1].children
      this.htmlColor = this.html.children[2]

      this.setActiveColorElement(this.htmlColors[this.selected])

      // link up mixer
      this.mixer.setLabel(this.htmlColor)
      this.mixer.onChange = (color) => {
         this.setColor(color)
      }
   }
}
