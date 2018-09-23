class Pallet {
   constructor(html, options) {
      this.html = {
         container: html
      }

      this.mixer = options.mixer
      this.onChangeColor = options.onChangeColor
      this.onChangeSize = options.onChangeSize
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

   eventIncreaseBrushSize(e, element) {
      this.size += 1
      this.brushSizeChanged()
   }

   eventDecreaseBrushSize(e, element) {
      this.size -= 1
      this.brushSizeChanged()
   }

   brushSizeChanged() {
      this.size = Math.min(10, Math.max(1, this.size))
      this.html.brushSize.innerHTML = this.size
      this.onChangeSize(this.size)
   }

   setActiveColorElement(element) {
      for(var colorElement of this.html.colors) {
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

      this.html.color.style.background = stringColor
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
            classes: ['brush'],
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

      var bakedHTML = app.bakeHTML(htmlColorsRecipe)

      this.html.brushSize = bakedHTML.elements[0].children[1]
      this.html.colors = bakedHTML.elements[1].children
      this.html.color = bakedHTML.elements[2]

      this.setActiveColorElement(this.html.colors[this.selected])

      // link up mixer
      this.mixer.setLabel(this.html.color)
      this.mixer.onChange = (color) => {
         this.setColor(color)
      }

      bakedHTML.appendTo(this.html.container)
   }
}
