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
      this.setActiveColor(0)

      this.bakedHTML.append(this.mixer.bakedHTML)
      // link up mixer
      // this.mixer.setLabel(this.htmlColor)
      // this.mixer.onChange = (color) => {
      //    this.setColor(color)
      // }
   }

   eventClickColor(e, element) {
      this.setActiveColor(element.dataset.id)
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

   setActiveColor(colorId) {
      this.selected = colorId
      this.setColor(this.colors[colorId])

      // toggle color element active class
      for(var id = 0; id < this.colors.length; id++) {
         var colorElement = this.bakedHTML.ele('color_'+id)
         colorElement.classList.toggle('active', id == colorId)
      }

   }

   setColor(color) {
      this.color = color
      this.colors[this.selected] = color
      var stringColor = this.hslaToString(color)

      var mixerElement = this.bakedHTML.ele('mixer')
      var colorElement = this.bakedHTML.ele('color_'+this.selected)
      mixerElement.style.background = stringColor
      colorElement.style.background = stringColor

      //this.mixer.setColor(color)
      this.onChangeColor(this.color)
   }

   getColor() {
      return JSON.parse(JSON.stringify(this.colors[this.selected]))
   }

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   }

   htmlCreate() {
      this.bakedHTML = app.bakeHTML({
         classes: ['pallet', 'container']
      })

      var bakedHTMLBrush = app.bakeHTML({
         classes: ['brush'],
         events: {
            wheel: this.eventBrushSizeScroll.bind(this)
         },
         ingredients: [
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
      })

      var bakedHTMLColors = app.bakeHTML({
         classes: ['colors'],
         ingredients: this.colors.map((color, id) => ({
            classes: ['color'],
            data: { id },
            name: 'color_'+id,
            styles: {
               background: this.hslaToString(this.colors[id])
            },
            events: {
               click: this.eventClickColor.bind(this)
            }
         }))
      })

      var bakedMixer = app.bakeHTML({
         name: 'mixer',
         classes: ['mixer'],
         styles: {
            background: this.color
         }
      })

      // this.mixer.html.chooser
      this.bakedHTML.append(bakedHTMLBrush)
      this.bakedHTML.append(bakedHTMLColors)
      this.bakedHTML.append(bakedMixer)
   }
}
