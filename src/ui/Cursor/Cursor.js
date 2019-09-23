class Cursor extends Base  {

   constructor(options) {
      super()
      this.bakeHTML()

      this.eleContainer = this.bakedHTML.ele('cursor')
      this.eleCanvas = this.bakedHTML.ele('canvas')
      this.ctx = this.eleCanvas.getContext('2d')

      this.easelCanvas = {
         x: 0, y: 0, width: 32, height: 32, scale: 1
      }

      this.x = 0
      this.y = 0
      this.scale = 1
      this.size = 1
      this.selected = undefined
      this.color = '#000'
      this.mode = 'stroke'

      this.cursorScale = 10
      this.scale = 1

      this.frameWidth = 1
      this.frameHeight = 1

      this.onDown = options.onDown || function(){}
      this.onMove = options.onMove || function(){}
      this.onStroke = options.onStroke || function(){}
      this.onUp = options.onUp || function(){}
      this.onEraserDown = options.onEraserDown || function(){}

      this.mouse = {
         down: false,
         pointers: [],
         positionRaw: { x: 0, y: 0 },
         positionLast: { x: 0, y: 0 },
         positionCurrent: { x: 0, y: 0 },
         positionStart: { x: 0, y: 0 },
         positionEnd: { x: 0, y: 0 },
         positions: []
      }

      this.updateCanvas()
   }

   onEventMousedown(e) {
      this.mouseWithin = true
      var mouseButton = ['left', 'middle', 'right', 'nan', 'nan', 'eraser'][e.button]
      if (mouseButton === 'middle') return

      if(mouseButton === 'eraser') {
         this.onEraserDown()
      }

      this.mouse.down = true
      this.mouse.dragging = this.canMoveSelected()
      this.mouse.positionRaw = { x: e.offsetX, y: e.offsetY }
      this.mouse.positionStart = this.getPixelPositionsFromRaw(this.mouse.positionRaw)
      this.mouse.positionDelta = { x: 0, y: 0 }
      this.mouse.positionTotalDelta = { x: 0, y: 0 }
      this.mouse.positions = [ this.mouse.positionStart ] // pls roll over 0 to make a line

      this.onDown(this.mouse)
   }

   onEventMousemove(e) {
      this.mouseWithin = true
      this.mouse.positionRaw = { x: e.offsetX, y: e.offsetY }
      this.setMouseCoordinatesFromRaw()
   }

   onEventMouseleave(e) {
      this.mouseWithin = false
      this.update()

      this.setMouseCoordinatesFromRaw()
      this.onEventMouseup(e)
   }

   onEventMouseup(e) {
      if(!this.mouse.down) return
      this.mouse.positionRaw = { x: e.offsetX, y: e.offsetY }
      this.setMouseCoordinatesFromRaw()

      this.mouse.down = false
      this.mouse.positionEnd = this.getPixelPositionsFromRaw(this.mouse.positionRaw)

      this.onUp(this.mouse)
   }

   setMouseCoordinatesFromRaw() {
      var { x, y } = this.getPixelPositionsFromRaw(this.mouse.positionRaw)

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

   getPixelPositionsFromRaw({ x, y }) {
      var easelCanvasX = this.easelCanvas.xPercent * this.eleCanvas.clientWidth - this.easelCanvas.width/2
      var easelCanvasY = this.easelCanvas.yPercent * this.eleCanvas.clientHeight - this.easelCanvas.height/2

      var xPercent = (x - easelCanvasX) / this.easelCanvas.width
      var yPercent = (y - easelCanvasY) / this.easelCanvas.height

      var xPixel = Math.floor(xPercent * this.frameWidth)
      var yPixel = Math.floor(yPercent * this.frameHeight)
      // console.log('mouse pos', x, y, e.offsetY)
      return { x: xPixel, y: yPixel }
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

   updateFrames({ width, height }) {
      this.frameWidth = width
      this.frameHeight = height
      this.update()
   }

   updateColor(color) {
      this.color = color
   }

   update(options) {
      for(var option in options) this[option] = options[option]

      this.updateCanvas()
      this.renderCursor()
   }

   updateCanvas() {
      this.eleCanvas.style.cursor = this.getCursor()
      this.eleCanvas.width = this.eleContainer.clientWidth
      this.eleCanvas.height = this.eleContainer.clientHeight
      this.ctx.imageSmoothingEnabled = false

      this.ctx.clearRect(0, 0, this.eleCanvas.width, this.eleCanvas.height)
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
         width: scale * this.frameWidth,
         height: scale * this.frameHeight,
         scale: scale
      }

      this.update()
      this.setMouseCoordinatesFromRaw()
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
      if (!this.mouseWithin) return
      var cursorDimensions1px = { width:1, height: 1 }
      cursorDimensions1px = Object.assign(cursorDimensions1px, dimensions)
      this.drawCrosshair(cursorDimensions1px, '#FFF')
   }

   renderCursorModeErase(dimensions) {
      if (!this.mouseWithin) return

      var cursorDimensionsFullSize = {
         x: Math.ceil(dimensions.x - this.size/2),
         y: Math.ceil(dimensions.y - this.size/2),
         width: dimensions.width*this.size,
         height: dimensions.height*this.size
      }
      this.drawRectangleStroke(cursorDimensionsFullSize, '#FFF')
   }


   renderCursorModeStroke(dimensions) {
      if (!this.mouseWithin) return

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
      if (!this.mouseWithin) return

      this.drawRectangleFilled(dimensions, this.color)
      this.drawRectangleStroke(dimensions, 'rgba(255, 255, 255, 0.85)')
   }

   renderCursorModeSelect(dimensions) {
      // override dimensions to use 1px
      var cursorDimensions1px = { width: 1, height: 1 }
      cursorDimensions1px = Object.assign(cursorDimensions1px, dimensions)


      if(!this.mouse.down && !this.canMoveSelected()) {
         if (this.mouseWithin) {
            this.drawRectangleDashed(cursorDimensions1px)
         }
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
      var lineLength = 15
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 3
      this.ctx.moveTo(x, y + height/2)
      this.ctx.lineTo(x-lineLength, y + height/2)
      this.ctx.stroke()

      this.ctx.moveTo(x+width, y + height/2)
      this.ctx.lineTo(x+width+lineLength, y + height/2)
      this.ctx.stroke()

      this.ctx.moveTo(x+width/2, y)
      this.ctx.lineTo(x+width/2, y-lineLength)
      this.ctx.stroke()

      this.ctx.moveTo(x+width/2, y+height)
      this.ctx.lineTo(x+width/2, y+height+lineLength)
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

      var easelCanvasX = this.easelCanvas.xPercent * this.eleCanvas.clientWidth - this.easelCanvas.width/2
      var easelCanvasY = this.easelCanvas.yPercent * this.eleCanvas.clientHeight - this.easelCanvas.height/2

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
         ingredients: [
            {
               tag: 'canvas',
               name: 'canvas'
            }
         ]
      }
   }
}
