class Cursor {
   constructor(options) {
      this.x = 0
      this.y = 0
      this.width = 1
      this.height = 1
      this.scale = 1
      this.fill = true
      this.selected = undefined

      this.scale = 10
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
      var mx = this.mouse.positionCurrent.x
      var my = this.mouse.positionCurrent.y

      var canMoveSelected = this.selected
         && this.selected.x <= mx && this.selected.x + this.selected.width > mx
         && this.selected.y <= my && this.selected.y + this.selected.height > my

      if(canMoveSelected) return 'move'
      return 'default'
   }

   update(options) {
      for(var option in options) {
         this[option] = options[option]
      }

      this.renderCursor()
   }

   updateScale(scale) {
      this.scale = scale
      this.renderCursor()
   }

   renderCursor() {
      var cursorScale = 10
      this.htmlCanvas.style.cursor = this.getCursor()
      this.htmlCanvas.width = app.image.width*cursorScale
      this.htmlCanvas.height = app.image.height*cursorScale

      var x = Math.floor(this.x*cursorScale)
      var y = Math.floor(this.y*cursorScale)

      if(this.fill) {
         this.ctx.fillStyle = app.global.colorString
         this.ctx.fillRect(x, y, cursorScale, cursorScale)
      }

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      this.ctx.strokeRect(x+0.5, y+0.5, cursorScale-1, cursorScale-1)
      this.renderSelected()
   }

   renderSelected() {
      if(!this.selected) return
      var cursorScale = 10
      var x = Math.floor(this.selected.x*cursorScale)
      var y = Math.floor(this.selected.y*cursorScale)
      var width = Math.floor(this.selected.width*cursorScale)
      var height = Math.floor(this.selected.height*cursorScale)
      this.ctx.lineWidth = 4

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
