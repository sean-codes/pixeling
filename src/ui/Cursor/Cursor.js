class Cursor extends Base  {

   constructor(options) {
      super()
      this.bakeHTML()

      this.canvas = this.bakedHTML.ele('canvas')
      this.ctx = this.canvas.getContext('2d')

      this.easelCanvas = {
         x: 0, y: 0, width: 32, height: 32, scale: 1
      }

      this.x = 0
      this.y = 0
      this.width = 1
      this.height = 1
      this.scale = 1
      this.size = 1
      this.selected = undefined
      this.color = '#000'
      this.mode = 'stroke'

      this.cursorScale = 10
      this.scale = 1


      this.onDown = options.onDown || function(){}
      this.onMove = options.onMove || function(){}
      this.onStroke = options.onStroke || function(){}
      this.onUp = options.onUp || function(){}

      this.mouse = {
         down: false,
         positionLast: { x: 0, y: 0 },
         positionCurrent: { x: 0, y: 0 },
         positionStart: { x: 0, y: 0 },
         positionEnd: { x: 0, y: 0 },
         positions: []
      }

      this.updateCanvas()
   }

   eventMousedown(e, element) {
      var mouseButton = ['left', 'middle', 'right'][e.button]
      if(mouseButton != 'left') return

      this.mouse.down = true
      this.mouse.dragging = this.canMoveSelected()
      this.mouse.positionStart = this.getMouseEventPosition(e)
      this.mouse.positionLast = this.getMouseEventPosition(e)
      this.mouse.positionDelta = { x: 0, y: 0 }
      this.mouse.positionTotalDelta = { x: 0, y: 0 }
      this.mouse.positions = [ this.mouse.positionStart ] // pls roll over 0 to make a line

      this.onDown(this.mouse)
   }

   eventMousemove(e, element) {
      var { x, y } = this.getMouseEventPosition(e)

      var samePosition =
         this.mouse.positionCurrent.x == x &&
         this.mouse.positionCurrent.y == y

      // if same pixel skip (mouse did move but in same pixel)
      if(samePosition) return

      this.mouse.positionLast = {
         x: this.mouse.positionCurrent.x || x,
         y: this.mouse.positionCurrent.y || y
      }

      this.mouse.positionCurrent = { x, y }
      this.mouse.positionDelta = {
         x: x - this.mouse.positionLast.x,
         y: y - this.mouse.positionLast.y
      }

      this.mouse.positionTotalDelta = {
         x: x - this.mouse.positionStart.x,
         y: y - this.mouse.positionStart.y
      }


      if(this.mouse.down) {
         this.mouse.positions.push(this.mouse.positionCurrent)
         return this.onStroke(this.mouse)
      }

      this.onMove(this.mouse)
   }

   eventMouseleave(e, element) {
      this.eventMouseup(e, element)
   }

   eventMouseup(e, element) {
      if(!this.mouse.down) return
      this.mouse.down = false
      this.mouse.positionEnd  = { x: e.offsetX, y: e.offsetY }
      this.onUp(this.mouse)
   }

   getMouseEventPosition(e) {
      var eleCursor = this.bakedHTML.ele('canvas')
      var easelCanvas = this.easelCanvas

      var easelCanvasX = easelCanvas.xPercent * eleCursor.clientWidth - easelCanvas.width/2
      var easelCanvasY = easelCanvas.yPercent * eleCursor.clientHeight - easelCanvas.height/2

      var xPercent = (e.offsetX - easelCanvasX) / easelCanvas.width
      var yPercent = (e.offsetY - easelCanvasY) / easelCanvas.height

      var x = Math.floor(xPercent * app.frames.width)
      var y = Math.floor(yPercent * app.frames.height)
      // console.log('mouse pos', x, y, e.offsetY)
      return { x, y }
   }

   getCursor() {
      if(this.mode == 'select' && this.canMoveSelected()) return 'move'
      return 'default'
   }

   canMoveSelected() {
      if (!this.selected) return false

      var mx = this.mouse.positionCurrent.x
      var my = this.mouse.positionCurrent.y

      var select = this.selected
      return this.selected
         && select.x <= mx && select.x + select.width > mx
         && select.y <= my && select.y + select.height > my
   }

   update(options) {
      for(var option in options) this[option] = options[option]

      this.updateCanvas()
      this.renderCursor()
   }

   updateImage(image) {
      this.update()
   }

   updateCanvas() {
      this.canvas.style.cursor = this.getCursor()
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.ctx.imageSmoothingEnabled = false

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   }

   updateScale(scale) {
      this.scale = scale
      this.updateCanvas()
      this.renderCursor()
   }

   updateCanvasPositionAndScale(xPercent, yPercent, scale) {
      this.easelCanvas = {
         xPercent: xPercent,
         yPercent: yPercent,
         width: scale * app.frames.width,
         height: scale * app.frames.height,
         scale: scale
      }

      this.update()
   }

   renderCursor() {
      var cursorDimensions = {
         x: this.x,
         y: this.y,
         width: 1,
         height: 1
      }

      this.mode == 'erase' && this.renderCursorModeErase(cursorDimensions)
      this.mode == 'stroke' && this.renderCursorModeStroke(cursorDimensions)
      this.mode == 'fill' && this.renderCursorModeFill(cursorDimensions)
      this.mode == 'select' && this.renderCursorModeSelect(cursorDimensions)
      this.mode == 'move' && this.renderCursorModeMove(cursorDimensions)
      this.mode == 'read' && this.renderCursorModeRead(cursorDimensions)
   }

   renderCursorModeRead(dimensions) {
      var cursorDimensions1px = { width:1, height: 1 }
      cursorDimensions1px = Object.assign(cursorDimensions1px, dimensions)
      this.drawCrosshair(cursorDimensions1px, '#FFF')
   }

   renderCursorModeErase(dimensions) {
      var cursorDimensionsFullSize = {
         x: Math.ceil(dimensions.x - this.size/2),
         y: Math.ceil(dimensions.y - this.size/2),
         width: dimensions.width*this.size,
         height: dimensions.height*this.size
      }
      this.drawRectangleStroke(cursorDimensionsFullSize, '#FFF')
   }

   renderCursorModeStroke(dimensions) {
      var cursorDimensionsFullSize = {
         x: Math.ceil(dimensions.x - this.size/2),
         y: Math.ceil(dimensions.y - this.size/2),
         width: dimensions.width*this.size,
         height: dimensions.height*this.size
      }

      this.drawRectangleFilled(cursorDimensionsFullSize, this.color)
      this.drawRectangleStroke(cursorDimensionsFullSize, 'rgba(255, 255, 255, 0.85)')
   }

   renderCursorModeFill(dimensions) {
      this.drawRectangleFilled(dimensions, this.color)
      this.drawRectangleStroke(dimensions, 'rgba(255, 255, 255, 0.85)')
   }

   renderCursorModeSelect(dimensions) {
      // override dimensions to use 1px
      var cursorDimensions1px = { width: 1, height: 1 }
      cursorDimensions1px = Object.assign(cursorDimensions1px, dimensions)

      if(!this.mouse.down && !this.canMoveSelected()) {
         this.drawRectangleDashed(cursorDimensions1px)
      }

      if(this.selected) {
         this.drawRectangleDashed(this.selected)
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

   drawCrosshair(dimensions, color) {
      var { x, y, width, height } = this.scaleDimensions(dimensions)

      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 3
      this.ctx.moveTo(x, y + height/2)
      this.ctx.lineTo(x-width/2, y+height/2)
      this.ctx.stroke()

      this.ctx.moveTo(x+width, y + height/2)
      this.ctx.lineTo(x+width+width/2, y+height/2)
      this.ctx.stroke()

      this.ctx.moveTo(x+width/2, y)
      this.ctx.lineTo(x+width/2, y-height/2)
      this.ctx.stroke()

      this.ctx.moveTo(x+width/2, y+height)
      this.ctx.lineTo(x+width/2, y+height+height/2)
      this.ctx.stroke()
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

      var eleCursor = this.bakedHTML.ele('canvas')
      var easelCanvas = this.easelCanvas
      var easelCanvasX = this.easelCanvas.xPercent * eleCursor.clientWidth - this.easelCanvas.width/2
      var easelCanvasY = this.easelCanvas.yPercent * eleCursor.clientHeight - this.easelCanvas.height/2

      return {
         x: Math.floor(easelCanvasX + (x * this.easelCanvas.scale)),
         y: Math.floor(easelCanvasY + (y * this.easelCanvas.scale)),
         width: Math.ceil(width*this.easelCanvas.scale),
         height: Math.ceil(height*this.easelCanvas.scale)
      }
   }

   recipe() {
      return {
         name: 'cursor',
         classes: ['ui', 'cursor'],
         events: {
            mousemove: this.eventMousemove.bind(this),
            mouseleave: this.eventMouseleave.bind(this),
            mousedown: this.eventMousedown.bind(this),
            mouseup: this.eventMouseup.bind(this),
         },
         ingredients: [
            {
               tag: 'canvas',
               name: 'canvas'
            }
         ]
      }
   }
}
