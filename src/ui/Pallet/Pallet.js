class Pallet extends Base{
   constructor(options) {
      super()
      this.onChangeColor = options.onChangeColor
      this.onChangeSize = options.onChangeSize
      this.tempSize = 1
      this.size = 1
      this.sizeChangeDampener = Date.now()

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
         this.setColor(color, false)
      }

      // set initial color
      this.setActiveColor(0)
      this.setColor(this.colors[0], true)
   }

   eventClickColorMixer(e, bakedHTML) {
      this.mixer.toggle()
   }

   eventClickColor(e, bakedHTML) {
      const colorId = Number(bakedHTML.element.dataset.id)
      this.setActiveColor(colorId)
      this.setColor(this.colors[colorId], true)
   }

   eventClickAddColor(e, bakedHTML) {
      const clonedColor = { ...this.colors[this.selected] }
      const nextColorId = this.colors.length
      this.colors.push(clonedColor)

      // bake and append a new color
      const bakedNewColor = this.bake(this.recipeColor(clonedColor, nextColorId))
      this.bakedHTML.find('colors').insertBefore(bakedNewColor, bakedHTML)

      this.setActiveColor(nextColorId)
   }

   eventBrushSizeScroll(e, bakedHTML) {
      if(Date.now() - this.sizeChangeDampener > 50) {
         this.sizeChangeDampener = Date.now()
         this.tempSize += Math.sign(e.deltaY)
         this.brushSizeChanged()
      }
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

   nextColor() {
      var nextColorID = this.selected+1
      if(nextColorID == this.colors.length) nextColorID = 0
      this.setActiveColor(nextColorID)
      this.setColor(this.colors[nextColorID], true)
   }

   prevColor() {
      var nextColorID = this.selected-1
      if(nextColorID < 0) nextColorID = this.colors.length - 1
      this.setActiveColor(nextColorID)
      this.setColor(this.colors[nextColorID], true)
   }


   setActiveColor(colorId) {
      this.selected = colorId
      // this.setColor(this.colors[colorId], true)

      // toggle color element active class
      for(var id = 0; id < this.colors.length; id++) {
         var colorElement = this.bakedHTML.ele('color_'+id)
         colorElement.classList.toggle('active', id == colorId)
      }
   }

   setColor(newColor, andMixer, shouldFind = false) {
      // try and find a color
      let oldColorId = -1

      const oldColor = this.colors.find((c, i) => {
         if (Math.abs(c.h - newColor.h) < 1
            && Math.abs(c.s - newColor.s) < 1
            && Math.abs(c.l - newColor.l) < 1
            && Math.abs(c.a - newColor.a) < 0.01
         ) {
            oldColorId = i
            return true
         }
      })

      if (shouldFind && oldColor) {
         this.color = oldColor
         this.selected = oldColorId
         this.setActiveColor(oldColorId)
      } else {
         this.color = newColor
         this.colors[this.selected] = newColor
      }

      var stringColor = this.hslaToString(this.color)

      var mixerElement = this.bakedHTML.ele('mixer')
      var colorElement = this.bakedHTML.ele('color_'+this.selected)
      mixerElement.style.background = stringColor
      colorElement.style.background = stringColor

      andMixer && this.mixer.setColor(this.color)
      this.onChangeColor(this.color)
   }

   getColor() {
      return JSON.parse(JSON.stringify(this.colors[this.selected]))
   }

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   }

   recipeColor(color, id) {
       return {
         classes: ['color'],
         data: { id },
         name: 'color_'+id,
         styles: {
            background: this.hslaToString(this.colors[id])
         },
         events: {
            click: this.eventClickColor.bind(this)
         }
      }
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
         name: 'colors',
         ingredients: this.colors.map((color, id) => this.recipeColor(color, id))
      }

      // add the add color button
      recipeColors.ingredients.push({
         classes: ['color', 'add'],
         name: 'color_add',
         innerHTML: '+',
         events: {
            click: this.eventClickAddColor.bind(this)
         }
      })

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
