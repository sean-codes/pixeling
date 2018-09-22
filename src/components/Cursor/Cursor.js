class Cursor {
   constructor(options) {
      this.x = 0
      this.y = 0
      this.width = 1
      this.height = 1
      this.scale = 1
      this.size = 1
      this.fill = true
      this.selected = undefined
      this.color = '#000'
      this.mode = 'stroke'

      this.initialScale = 10
      this.scale = this.initialScale
      this.onDown = options.onDown || function(){}
      this.onMove = options.onMove || function(){}
      this.onStroke = options.onStroke || function(){}
      this.onUp = options.onUp || function(){}

      this.mouse = {
         down: false,
         positionLast: { x: 0, y: 0 },
         positionCurrent: { x: 0, y: 0 },
         positionStart: { x: 0, y: 0 },
         PositionEnd: { x: 0, y: 0 }
      }

      this.createCursorCanvas()
      this.renderCursor()
   }

   eventMousedown(e, element) {
      var mouseButton = ['left', 'middle', 'right'][e.button]
      if(mouseButton != 'left') return

      this.mouse.down = true
      this.mouse.dragging = this.canMoveSelected()
      this.mouse.positionStart = {
         x: Math.floor(e.offsetX / this.scale),
         y: Math.floor(e.offsetY / this.scale)
      }

      this.mouse.positionLast = {
         x: Math.floor(e.offsetX / this.scale),
         y: Math.floor(e.offsetY / this.scale)
      }
      this.onDown(this.mouse)
   }

   eventMousemove(e, element) {
      var x = Math.floor(e.offsetX / this.scale)
      var y = Math.floor(e.offsetY / this.scale)

      var samePosition =
         this.mouse.positionCurrent.x == x &&
         this.mouse.positionCurrent.y == y

      // if same pixel skip (mouse did move but in same pixel)
      if(samePosition) return

      this.mouse.positionCurrent = { x, y }
      this.mouse.positionDelta = {
         x: x - this.mouse.positionLast.x,
         y: y - this.mouse.positionLast.y
      }

      this.mouse.positionTotalDelta = {
         x: x - this.mouse.positionStart.x,
         y: y - this.mouse.positionStart.y
      }
      this.mouse.positionLast = { x, y }
      // i see you noticed the pixel skipping
      // within / around here
      // we need to run this between delta x and y to fill in the gaps
      // 1. find the angle between last position and current
      // 2. we could brute force or run on only the pixels between once
      this.mouse.down ? this.onStroke(this.mouse) : this.onMove(this.mouse)
   }

   eventMouseup(e, element) {
      if(!this.mouse.down) return
      this.mouse.down = false
      this.mouse.positionEnd  = { x: e.offsetX, y: e.offsetY }
      this.onUp(this.mouse)
   }

   getCursor() {
      if(this.canMoveSelected()) return 'move'
      return 'default'
   }

   canMoveSelected() {
      var mx = this.mouse.positionCurrent.x
      var my = this.mouse.positionCurrent.y

      return this.selected
         && this.selected.x <= mx && this.selected.x + this.selected.width > mx
         && this.selected.y <= my && this.selected.y + this.selected.height > my
   }

   update(options) {
      for(var option in options) {
         this[option] = options[option]
      }

      this.renderCursor()
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.renderCursor()
   }

   renderCursor() {
      var cursorScale = this.scale
      this.htmlCanvas.style.cursor = this.getCursor()
      this.htmlCanvas.width = app.image.width*cursorScale
      this.htmlCanvas.height = app.image.height*cursorScale

      var x = Math.floor(this.x*cursorScale)
      var y = Math.floor(this.y*cursorScale)

      if(this.fill) {
         this.ctx.fillStyle = this.color
         this.ctx.fillRect(
            Math.floor(x),
            Math.floor(y),
            Math.ceil(cursorScale*this.size),
            Math.ceil(cursorScale*this.size)
         )
      }

      if(this.mode == 'stroke') {
         this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
         this.ctx.strokeRect(
            Math.floor(x)-1,
            Math.floor(y)-1,
            Math.ceil(cursorScale*this.size+2),
            Math.ceil(cursorScale*this.size+2)
         )
      }

      if(this.mode == 'select') {
         this.ctx.lineWidth = 4
         this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
         this.ctx.strokeRect(
            Math.floor(x)-1,
            Math.floor(y)-1,
            Math.ceil(cursorScale+2),
            Math.ceil(cursorScale+2)
         )

         this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
         this.ctx.setLineDash([8]);
         this.ctx.strokeRect(
            Math.floor(x)-1,
            Math.floor(y)-1,
            Math.ceil(cursorScale+2),
            Math.ceil(cursorScale+2)
         )

         this.ctx.setLineDash([0]);
      }
      this.renderSelected()
   }

   renderSelected() {
      if(!this.selected) return
      var cursorScale = this.scale
      var x = Math.floor(this.selected.x*cursorScale)
      var y = Math.floor(this.selected.y*cursorScale)
      var width = Math.floor(this.selected.width*cursorScale)
      var height = Math.floor(this.selected.height*cursorScale)
      this.ctx.lineWidth = 4

      if(this.selected.copy) {
         for(var pixelID in this.selected.copy.pixels) {
            var pixel = this.selected.copy.pixels[pixelID]

            var pX = x + pixel.position.x * cursorScale
            var pY = y + pixel.position.y * cursorScale

            this.ctx.fillStyle = pixel.colorString
            this.ctx.fillRect(
               Math.ceil(pX),
               Math.ceil(pY),
               Math.floor(cursorScale),
               Math.floor(cursorScale)
            )
         }
      }

      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.strokeRect(x+this.ctx.lineWidth/2, y+this.ctx.lineWidth/2, width-this.ctx.lineWidth, height-this.ctx.lineWidth)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      this.ctx.setLineDash([9]);
      this.ctx.strokeRect(x+this.ctx.lineWidth/2, y+this.ctx.lineWidth/2, width-this.ctx.lineWidth, height-this.ctx.lineWidth)
   }

   createCursorCanvas() {
      this.htmlCanvas = app.bakeHTML([
         {
            tag: 'canvas',
            classes: ['cursor'],
            events: {
               mousedown: this.eventMousedown.bind(this),
               mousemove: this.eventMousemove.bind(this),
               mouseleave: this.eventMouseup.bind(this),
               mouseup: this.eventMouseup.bind(this),
            }
         }
      ]).first()

      this.ctx = this.htmlCanvas.getContext('2d')
   }
}
