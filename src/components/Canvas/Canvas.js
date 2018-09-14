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
   }

   eventMousedown(e, element) {
      this.mouse.down = true
      this.mouse.positionStart = { x: e.offsetX, y: e.offsetY }
      this.onDown()
   }

   eventMousemove(e, element) {
      this.mouse.positionCurrent  = { x: e.offsetX, y: e.offsetY }
      this.onMove(this.mouse)
      if(this.mouse.down) this.onStroke(this.mouse)
   }

   eventMouseup(e, element) {
      this.mouse.down = false
      this.mouse.positionEnd  = { x: e.offsetX, y: e.offsetY }
      this.onUp()
   }

   createCanvas() {
      var htmlBakeRecipe = [{
         tag: 'canvas',
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
      for(var pixel of image.pixels) {
         this.ctx.fillStyle = pixel.color
         this.ctx.fillRect(pixel.position.x, pixel.position.y, 1, 1)
      }
   }
}
