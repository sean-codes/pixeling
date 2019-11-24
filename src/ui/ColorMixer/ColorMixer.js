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
      this.updateCanvasAndValue()
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

   eventOptionMousedown(e, bakedHTML) {
      bakedHTML.data('moving', true)
   }

   eventOptionMouseout(e, bakedHTML) {
      bakedHTML.data('moving', false)
   }

   eventOptionMousemove(e, bakedHTML) {
      if(!bakedHTML.data('moving')) return

      var name = bakedHTML.data('name')
      var bakedOptionElement = this.bakedHTML.find('option_'+name)
      var htmlCursor = bakedOptionElement.ele('option_cursor_'+name)
      var htmlCanvas = bakedOptionElement.ele('option_canvas_' + name)
      var htmlValue = bakedOptionElement.ele('option_value_' + name)

      var elementWidth = htmlCanvas.clientWidth
      var percent = Math.max(0, Math.min(1, e.offsetX / elementWidth))
      var name = bakedHTML.data('name')

      htmlCursor.style.left = percent*100 + '%'

      var colorPart = this.hsla[name]
      colorPart.value = colorPart.max > 1
         ? Math.round(percent * colorPart.max) // 255 value
         : Math.round(percent * colorPart.max * 100)/100 // 1 value (alpha)

      htmlValue.value = colorPart.value

      this.updateCanvasAndValue(name)
      this.onChange(this.getHSLA())
   }

   eventOptionValueKeyDown(e) {
      e.stopPropagation()
   }

   eventOptionValueChange(e, bakedHTML) {
      const max = Number(bakedHTML.element.getAttribute('max'))
      const min = Number(bakedHTML.element.getAttribute('min'))
      const value = Number(e.target.value)
      const between = Math.min(max, Math.max(min, value))

      const currentHsla = this.getHSLA()
      currentHsla[bakedHTML.data('name')[0]] = Number(between)
      this.setColor(currentHsla)
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

      this.updateCanvasAndValue()
   }

   updateCanvasAndValue(colorValueName) {
      for(var name in this.hsla) {
         if (name === colorValueName) continue

         var part = this.hsla[name]
         var bakedOptionElement = this.bakedHTML.find('option_'+name)
         var htmlCursor = bakedOptionElement.ele('option_cursor_'+name)
         var htmlCanvas = bakedOptionElement.ele('option_canvas_'+name)
         var htmlValue = bakedOptionElement.ele('option_value_'+name)

         // update value
         htmlValue.value = part.value

         // update curor
         htmlCursor.style.left = part.value / part.max * 100 + '%'

         // update colors
         var ctx = htmlCanvas.getContext('2d')
         htmlCanvas.width = part.max/part.step
         htmlCanvas.height = 100 // max height 100

         ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height)

         for(var x = 0; x < part.max; x += part.step) {
            var h = name == 'hue' ? x : this.hsla.hue.value
            var s = name == 'saturation' ? x : this.hsla.saturation.value
            var l = name == 'lightness' ? x : this.hsla.lightness.value
            var a = name == 'alpha' ? x : this.hsla.alpha.value
            ctx.fillStyle = 'hsla('+h+', '+s+'%, '+l+'%,'+a+')'

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
         classes: [ 'ui', 'colorMixer', 'hide' ],
         ingredients: optionRecipes
      }
   }

   optionRecipe(name) {
      var sliderEvents = {
         mousemove: this.eventOptionMousemove.bind(this),
         mousedown: this.eventOptionMousedown.bind(this),
         mouseup: this.eventOptionMouseout.bind(this),
         mouseleave: this.eventOptionMouseout.bind(this),
      }

      const supportsPointerEvents = window.PointerEvent ? true : false
      if (supportsPointerEvents) {
         sliderEvents = {
            pointermove: this.eventOptionMousemove.bind(this),
            pointerdown: this.eventOptionMousedown.bind(this),
            pointerup: this.eventOptionMouseout.bind(this),
            pointerleave: this.eventOptionMouseout.bind(this),
         }
      }

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
               name: 'option_slider_' + name,
               data: { name },
               ingredients: [
                  {
                     tag: 'canvas',
                     name: 'option_canvas_' + name,
                  },
                  {
                     name: 'option_cursor_' + name,
                     classes: ['cursor']
                  }
               ],
               events: sliderEvents
            },
            {
               name: 'option_value_' + name,
               tag: 'input',
               classes: ['value'],
               attr: {
                  type: 'number',
                  value: 255,
                  min: 0,
                  max: this.hsla[name].max,
                  step: this.hsla[name].step,
               },
               data: { name: name },
               events: {
                  input: this.eventOptionValueChange.bind(this),
                  keydown: this.eventOptionValueKeyDown.bind(this)
               }
            }
         ]
      }
   }
}
