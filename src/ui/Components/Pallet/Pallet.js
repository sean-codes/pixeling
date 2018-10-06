class Pallet extends Base{
   constructor(options) {
      super()
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
      this.bakeHTML()

      // set up mixer
      this.mixer = options.mixer
      this.bakedHTML.append(this.mixer.bakedHTML)
      this.mixer.onChange = (color) => {
         this.setColor(color)
      }

      // set initial color
      this.setActiveColor(0)
   }

   eventClickColorMixer(e, bakedHTML) {
      this.mixer.toggle()
   }

   eventClickColor(e, bakedHTML) {
      this.setActiveColor(bakedHTML.element.dataset.id)
   }

   eventBrushSizeScroll(e, bakedHTML) {
      this.tempSize += Math.sign(e.deltaY) * 0.25
      this.brushSizeChanged()
   }

   eventIncreaseBrushSize(e, bakedHTML) {
      this.tempSize += 1
      this.brushSizeChanged()
   }

   eventDecreaseBrushSize(e, bakedHTML) {
      this.tempSize -= 1
      this.brushSizeChanged()
   }

   brushSizeChanged() {
      this.tempSize = Math.min(20, Math.max(1, this.tempSize))
      this.size = Math.round(this.tempSize)

      var htmlBrushSize = this.bakedHTML.ele('brushsize')
      htmlBrushSize.innerHTML = this.size
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

      this.mixer.setColor(color)
      this.onChangeColor(this.color)
   }

   getColor() {
      return JSON.parse(JSON.stringify(this.colors[this.selected]))
   }

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   }

   recipe() {
      var recipeBrushSize = {
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
            { classes: ['size'], name: 'brushsize', innerHTML: '1' },
            {
               classes: ['control'],
               innerHTML: '>',
               events: {
                  click: this.eventIncreaseBrushSize.bind(this)
               }
            }
         ]
      }

      var recipeColors = {
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
      }

      var recipeMixer = {
         name: 'mixer',
         classes: ['mixer'],
         styles: {
            background: this.color
         },
         events: {
            click: this.eventClickColorMixer.bind(this)
         }
      }

      return {
         classes: ['pallet', 'container'],
         ingredients: [
            recipeBrushSize,
            recipeColors,
            recipeMixer
         ]
      }
   }
}
