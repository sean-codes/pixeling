class Cursor {
   constructor(options) {
      this.x = 0
      this.y = 0
      this.width = 1
      this.height = 1
      this.scale = 1
      this.size = 1
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

      this.createHTML()
      this.update()
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
      var x = Math.floor(e.offsetX / this.scale) - Math.floor(this.size/2)
      var y = Math.floor(e.offsetY / this.scale) - Math.floor(this.size/2)

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
      if(this.mode == 'select' && this.canMoveSelected()) return 'move'
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
      for(var option in options) this[option] = options[option]

      this.render()
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.render()
   }

   render() {
      this.updateHTML()
      this.renderCursor()
   }

   renderCursor() {
      var cursorDimensions = {
         x: this.x, y: this.y,
         width: this.size,
         height: this.size
      }

      this.mode == 'erase' && this.renderCursorModeErase(cursorDimensions)
      this.mode == 'stroke' && this.renderCursorModeStroke(cursorDimensions)
      this.mode == 'select' && this.renderCursorModeSelect(cursorDimensions)
      this.mode == 'move' && this.renderCursorModeMove(cursorDimensions)
   }

   renderCursorModeErase(dimensions) {
      this.drawRectangleStroke(dimensions, '#FFF')
   }

   renderCursorModeStroke(dimensions) {
      this.drawRectangleFilled(dimensions, this.color)
      this.drawRectangleStroke(dimensions, 'rgba(255, 255, 255, 0.85)')
   }

   renderCursorModeSelect(dimensions) {
      // override dimensions to use 1px
      var cursorDimensions1px = { ...dimensions, width:1, height: 1 }
      !this.canMoveSelected() && this.drawRectangleDashed(cursorDimensions1px)

      if(this.selected) {
         this.selected.copy && this.drawSelectedPixels()
         this.drawRectangleDashed(this.selected)
      }
   }

   drawSelectedPixels() {
      for(var pixelID in this.selected.copy.pixels) {
         var pixel = this.selected.copy.pixels[pixelID]
         var pixelDimensions = {
            x: this.selected.x + pixel.position.x,
            y: this.selected.y + pixel.position.y,
            width: 1,
            height: 1
         }

         this.drawRectangleFilled(pixelDimensions, pixel.colorString)
      }
   }

   drawRectangleFilled(dimensions, color) {
      var { x, y, width, height } = this.scaleDimensions(dimensions)

      this.ctx.fillStyle = color
      this.ctx.fillRect(x, y, width, height)
   }

   drawRectangleStroke(dimensions, color) {
      var { x, y, width, height } = this.scaleDimensions(dimensions)

      this.ctx.strokeStyle = color
      this.ctx.strokeRect(x-1, y-1, width+2, height+2)
   }

   drawRectangleDashed(dimensions) {
      var { x, y, width, height } = this.scaleDimensions(dimensions)

      var lineWidth = 4
      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.strokeRect(x+lineWidth/2, y+lineWidth/2, width-lineWidth, height-lineWidth)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      this.ctx.setLineDash([9]);
      this.ctx.strokeRect(x+lineWidth/2, y+lineWidth/2, width-lineWidth, height-lineWidth)
      this.ctx.setLineDash([0])
      this.ctx.lineWidth = 1
   }

   scaleDimensions(dimensions) {
      var { x, y, width, height } = dimensions

      return {
         x: Math.floor(x*this.scale),
         y: Math.floor(y*this.scale),
         width: Math.ceil(width*this.scale),
         height: Math.ceil(height*this.scale)
      }
   }

   updateHTML() {
      var cursorScale = this.scale
      this.htmlCanvas.style.cursor = this.getCursor()
      this.htmlCanvas.width = app.image.width*cursorScale
      this.htmlCanvas.height = app.image.height*cursorScale
   }

   createHTML() {
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
