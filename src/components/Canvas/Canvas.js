class Canvas {
   constructor(options) {
      this.createCanvas()
      this.image = options.image
      this.onDown = options.onDown || function(){}
      this.onMove = options.onMove || function(){}
      this.onStroke = options.onStroke || function(){}
      this.onUp = options.onUp || function(){}

      this.mouse = {
         down: false,
         pos: { x: 0, y: 0 }
      }

      this.scale = 10
      this.htmlCanvas.width = this.image.width*this.scale
      this.htmlCanvas.height = this.image.height*this.scale

      this.resetCanvas()
      this.renderImage()
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

   updateImage(image) {
      this.image = image
      this.resetCanvas()
      this.renderImage()
   }

   renderImage() {
      for(var pixel of this.image.pixels) {
         this.ctx.fillStyle = pixel.color
         this.ctx.fillRect(
            pixel.position.x*this.scale,
            pixel.position.y*this.scale,
            this.scale,
            this.scale
         )
      }
   }

   resetCanvas() {
      this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height)
      this.htmlCanvas.width = this.image.width*this.scale
      this.htmlCanvas.height = this.image.height*this.scale
      this.drawCheckerBoard()
   }

   drawCheckerBoard() {
      var size = 16
      var spacesX = Math.ceil(this.image.width / size)
      var spacesY = Math.ceil(this.image.height / size)
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            if(counter % 2) this.ctx.fillRect(
               x*size*this.scale,
               y*size*this.scale,
               this.scale*size,
               this.scale*size
            )
            counter += 1
         }
         if(spacesY % 2 == 0) counter += 1
      }
   }
}
