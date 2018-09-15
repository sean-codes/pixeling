class Canvas {
   constructor(options) {
      this.createCanvas()
      this.onDown = options.onDown || function(){}
      this.onMove = options.onMove || function(){}
      this.onStroke = options.onStroke || function(){}
      this.onUp = options.onUp || function(){}

      this.mouse = {
         down: false,
         pos: { x: 0, y: 0 }
      }

      this.scale = 10
      this.renderImage(options.image)
   }

   eventMousedown(e, element) {
      var mouseButton = ['left', 'middle', 'right'][e.button]
      if(mouseButton != 'left') return

      this.mouse.down = true
      this.mouse.positionStart = {
         x: Math.floor(e.offsetX / this.scale),
         y: Math.floor(e.offsetY / this.scale)
      }
      this.onDown(this.mouse)
   }

   eventMousemove(e, element) {
      this.mouse.positionCurrent = {
         x: Math.floor(e.offsetX / this.scale),
         y: Math.floor(e.offsetY / this.scale)
      }

      this.onMove(this.mouse)

      // i see you noticed the pixel skipping
      // within / around here
      // we need to run this between delta x and y to fill in the gaps
      // 1. find the angle between last position and current
      // 2. we could brute force or run on only the pixels between once
      if(this.mouse.down) this.onStroke(this.mouse)
   }

   eventMouseup(e, element) {
      if(!this.mouse.down) return
      this.mouse.down = false
      this.mouse.positionEnd  = { x: e.offsetX, y: e.offsetY }
      this.onUp()
   }

   createCanvas() {
      var htmlBakeRecipe = [{
         tag: 'canvas',
         classes: ['canvas'],
         events: {
            mousedown: this.eventMousedown.bind(this),
            mousemove: this.eventMousemove.bind(this),
            mouseleave: this.eventMouseup.bind(this),
            mouseup: this.eventMouseup.bind(this),
         }
      }]

      var bakedHTML = app.script.bakeHTML(htmlBakeRecipe)
      this.htmlCanvas = bakedHTML.elements[0]
      this.ctx = this.htmlCanvas.getContext('2d')
   }

   renderImage(image) {
      this.htmlCanvas.width = image.width*this.scale
      this.htmlCanvas.height = image.height*this.scale

      for(var pixel of image.pixels) {
         this.ctx.fillStyle = pixel.color
         this.ctx.fillRect(
            pixel.position.x*this.scale,
            pixel.position.y*this.scale,
            this.scale,
            this.scale
         )
      }
   }
}
