class ColorMixer {
   constructor(options = {}) {
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

      this.htmlCreate()
      this.updateCanvasColors()
   }

   toggleChooser() {
      this.html.chooser.classList.toggle('hide')
   }

   show() {
      this.html.chooser.classList.toggle('hide', false)
   }

   hide() {
      this.html.chooser.classList.toggle('hide', true)
   }

   setLabel(element) {
      this.label = element
      this.label.addEventListener('click', () => {
         this.toggleChooser()
      })
   }

   moveSlider(e, element) {
      var elementWidth = element.getBoundingClientRect().width
      var percent = e.offsetX / elementWidth
      var name = element.dataset.name

      var htmlCursor = this.html[name].querySelector('.cursor')
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
         var htmlCursor = this.html[name].querySelector('.cursor')
         var htmlCanvas = this.html[name].querySelector('canvas')

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
   htmlCreate() {
      this.html = {}

      this.html.chooser = this.htmlCreateChooser()
      this.html.hue = this.htmlCreateOption('hue')
      this.html.saturation = this.htmlCreateOption('saturation')
      this.html.lightness = this.htmlCreateOption('lightness')
      this.html.alpha = this.htmlCreateOption('alpha')

      this.html.chooser.appendChild(this.html.hue)
      this.html.chooser.appendChild(this.html.saturation)
      this.html.chooser.appendChild(this.html.lightness)
      this.html.chooser.appendChild(this.html.alpha)

      if(this.container) {
         this.html.container = this.container
         this.html.container.appendChild(this.html.chooser)
      }

      if(this.label) {
         this.setLabel(this.label)
      }
   }

   htmlCreateChooser() {
      var htmlChooser = document.createElement('div')
      htmlChooser.classList.add('colorMixer')
      //htmlChooser.classList.add('hide')

      // prevent closing
      htmlChooser.addEventListener('click', (e) => {
         e.stopPropagation()
      })

      return htmlChooser
   }

   htmlCreateOption(name) {
      var html = {
         container: document.createElement('div'),
         name: document.createElement('div'),
         canvasContainer: document.createElement('div'),
         canvas: document.createElement('canvas'),
         cursor: document.createElement('div')
      }
      // setup
      html.container.classList.add('option')
      html.name.classList.add('name')
      html.name.innerHTML = name[0]
      html.canvas.dataset.name = name
      html.canvasContainer.classList.add('canvas')
      html.cursor.classList.add('cursor')

      var that = this
      html.canvas.addEventListener('mousemove', function(e) {
         if(e.buttons) that.moveSlider(e, this)
      })

      // append
      html.canvasContainer.appendChild(html.canvas)
      html.canvasContainer.appendChild(html.cursor)
      html.container.appendChild(html.name)
      html.container.appendChild(html.canvasContainer)

      return html.container
   }
}
