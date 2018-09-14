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
      this.onDown()
   }

   eventMousemove(e, element) {
      this.mouse.pos.x = e.clientX
      this.mouse.pos.y = e.clientY
      this.onMove(this.mouse)
      if(this.mouse.down) this.onStroke(this.mouse)
   }

   eventMouseup(e, element) {
      this.mouse.down = false
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
   }
}
