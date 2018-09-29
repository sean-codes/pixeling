class ColorMixer extends Base  {
   constructor(options = {}) {
      super()
      this.label = options.label
      this.container = options.container

      this.onChange = options.onChange || function(){}
      this.onChange.bind(this)
      this.hsla = {
         hue: { value: 0, end: '', min: 0, max: 360, step: 1 },
         saturation: { value: 100, end: '', min: 0, max: 100, step: 1 },
         lightness: { value: 100, end: '', min: 0, max: 100, step: 1 },
         alpha: { value: 1, end: '', min: 0, max: 1, step: 0.01 }
      }

      this.bakeHTML()
      this.updateCanvasColors()
   }

   show() { this.bakedHTML.element.classList.add('hide') }
   hide() { this.bakedHTML.element.classList.remove('hide') }
   toggle() { this.bakedHTML.element.classList.toggle('hide') }

   setLabel(element) {
      this.label = element
      this.label.addEventListener('click', () => {
         this.toggleChooser()
      })
   }

   eventMousedownOption(e, bakedHTML) {
      bakedHTML.data('moving', 'true')
   }

   eventMouseoutOption(e, bakedHTML) {
      bakedHTML.data('moving', 'false')
   }

   eventMousemoveOption(e, bakedHTML) {

      if(bakedHTML.data('moving') == 'false') return

      var htmlCanvas = bakedHTML.ele('canvas')

      var elementWidth = htmlCanvas.clientWidth
      var percent = e.offsetX / elementWidth
      var name = bakedHTML.data('name')

      var htmlCursor = bakedHTML.ele('cursor')
      htmlCursor.style.left = percent*100 + '%'

      var colorPart = this.hsla[name]
      colorPart.value = colorPart.max * Math.ceil(percent*100)/100

      this.updateColor()
      this.onChange(this.getHSLA())
   }

   getHSLA() {
      return {
         h: this.hsla.hue.value,
         s: this.hsla.saturation.value,
         l: this.hsla.lightness.value,
         a: this.hsla.alpha.value
      }
   }

   setColor(color) {
      this.hsla.hue.value = color.h
      this.hsla.saturation.value = color.s
      this.hsla.lightness.value = color.l
      this.hsla.alpha.value = color.a

      this.updateColor()
   }

   updateColor() {
      var h = Math.round(this.hsla.hue.value)
      var s = Math.round(this.hsla.saturation.value)
      var l = Math.round(this.hsla.lightness.value)
      var a = Math.round(this.hsla.alpha.value*100)/100
      var color = `hsla(${h}, ${s}%, ${l}%, ${a})`

      this.updateCanvasColors()
   }

   updateCanvasColors() {
      for(var name in this.hsla) {
         var part = this.hsla[name]
         var bakedOptionElement = this.bakedHTML.find('option_'+name)
         var htmlCursor = bakedOptionElement.ele('cursor')
         var htmlCanvas = bakedOptionElement.ele('canvas')

         // update curor
         htmlCursor.style.left = part.value / part.max * 100 + '%'

         // update colors
         var ctx = htmlCanvas.getContext('2d')
         htmlCanvas.width = part.max/part.step
         htmlCanvas.height = 100 // max height 100

         ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height)

         for(var x = 0; x < part.max; x += part.step) {
            ctx.fillStyle = `hsla(
               ${name == 'hue' ? x : this.hsla.hue.value},
               ${name == 'saturation' ? x : this.hsla.saturation.value}%,
               ${name == 'lightness' ? x : this.hsla.lightness.value}%,
               ${name == 'alpha' ? x : this.hsla.alpha.value}
            )`

            var percent = x / part.max
            var xPosition = percent * htmlCanvas.width
            ctx.fillRect(xPosition, 0, 1, htmlCanvas.height)
         }
      }
   }

   // worse than jquery :]
   recipe() {
      var colorParts = ['hue', 'saturation', 'lightness', 'alpha']
      var optionRecipes = colorParts.map((name) => this.optionRecipe(name))

      return {
         classes: [ 'colorMixer' ],
         ingredients: optionRecipes
      }
   }

   optionRecipe(name) {
      return {
         name: 'option_'+name,
         classes: ['option'],
         data: { name, moving: false },
         ingredients: [
            {
               classes: ['label'],
               innerHTML: name[0]
            },
            {
               classes: ['slider'],
               ingredients: [
                  {
                     tag: 'canvas',
                     name: 'canvas'
                  },
                  {
                     name: 'cursor',
                     classes: ['cursor']
                  }
               ]
            }
         ],
         events: {
            mousemove: this.eventMousemoveOption.bind(this),
            mousedown: this.eventMousedownOption.bind(this),
            mouseup: this.eventMouseoutOption.bind(this),
            mouseout: this.eventMouseoutOption.bind(this),
            mouseleave: this.eventMouseoutOption.bind(this),
         }
      }
   }
}
