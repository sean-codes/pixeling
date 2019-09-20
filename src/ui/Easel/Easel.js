class Easel extends Base  {
   constructor(options) {
      super()

      this.uiCanvas = options.uiCanvas
      this.uiCursor = options.uiCursor

      this.frameWidth = 0
      this.frameHeight = 0

      this.bakeHTML()

      this.eleEasel = this.bakedHTML.ele('easel')
      this.onScale = options.onScale || function(){}

      this.xRatio = 0
      this.yRatio = 0

      this.moving = false
      this.moveDampen = 2

      this.scale = 10

      this.scaleMin = 0.1
      this.scaleMax = 64
      this.scaleDampen = 100
   }

   eventMousedown(e, element) {
      var isMiddleButton = e.button == 1

      if(isMiddleButton) {
         this.moving = true
      }
   }

   eventMouseup(e, element) {
      this.moving = false
   }

   eventMousemove(e, element) {
      if (this.moving) {
         var moveX = e.movementX
         var moveY = e.movementY

         this.moveCanvas(moveX, moveY)
      }
   }

   eventScroll(e) {
      e.preventDefault()

      var isZoom = e.ctrlKey
      if(isZoom) {
         // more scale = faster scaling
         // less scale = slower scaling
         var scaleChange = e.deltaY*(this.scale/this.scaleDampen)
         this.zoom(scaleChange)
      } else {
         var moveX = -e.deltaX / this.moveDampen
         var moveY = -e.deltaY / this.moveDampen
         this.moveCanvas(moveX , moveY)
      }
   }

   zoomIn() {
      this.zoom(-1)
   }

   zoomOut() {
      this.zoom(1)
   }

   zoomReset() {
      this.scale = 1
      this.onScale(this.scale)
   }

   zoom(amount) {
      var newScale = this.scale - amount
      var newScaleMinMax = Math.min(this.scaleMax, Math.max(this.scaleMin, newScale))
      var newScaleRounded = Math.round(newScaleMinMax*100)/100


      // attempt to keep curor in view
      var rectEasel = this.eleEasel.getBoundingClientRect()

      var canvasX = this.xRatio * rectEasel.width // x center of easel
      var canvasY = this.yRatio * rectEasel.height // y center of easel

      var mouseRawX = this.uiCursor.mouse.positionRaw.x
      var mouseRawY = this.uiCursor.mouse.positionRaw.y

      var mouseXRatio = (canvasX - mouseRawX) / (this.frameWidth * this.scale) // x ratio from center of canvas
      var mouseYRatio = (canvasY - mouseRawY) / (this.frameHeight * this.scale) // y ratio from center of canvas
      var widthChange = this.frameWidth * newScaleRounded - this.frameWidth * this.scale
      var heightChange = this.frameHeight * newScaleRounded - this.frameHeight * this.scale

      var moveXRatio = widthChange * mouseXRatio / rectEasel.width // i guessed a bunch of times :]
      var moveYRatio = heightChange * mouseYRatio / rectEasel.height

      this.xRatio += moveXRatio
      this.yRatio += moveYRatio

      this.setScale(newScaleRounded)
      this.setCanvas(this.xRatio, this.yRatio)
   }

   setScale(scale) {
      this.scale = scale
      this.onScale(this.scale)

      this.uiCanvas.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
   }

   moveCanvas(moveX, moveY) {
      var xRatio = this.xRatio + (moveX / this.eleEasel.clientWidth)
      var yRatio = this.yRatio + (moveY / this.eleEasel.clientHeight)

      this.setCanvas(xRatio, yRatio)
   }

   setCanvas(xRatio, yRatio) {
      var halfWidthCanvasRatio = (this.frameWidth/2*this.scale) / this.eleEasel.clientWidth
      var ratioPixelWidthToWidth = (this.scale / this.eleEasel.clientWidth)
      var maxXRatio = 1 + halfWidthCanvasRatio - ratioPixelWidthToWidth
      var minXRatio = -halfWidthCanvasRatio + ratioPixelWidthToWidth
      var xRatio = Math.max(minXRatio, Math.min(maxXRatio, xRatio))

      var halfHeightCanvasRatio = (this.frameHeight/2*this.scale) / this.eleEasel.clientHeight
      var ratioPixelHeightToHeight = (this.scale / this.eleEasel.clientHeight)
      var maxYRatio = 1 + halfHeightCanvasRatio - ratioPixelHeightToHeight
      var minYRatio = -halfHeightCanvasRatio + ratioPixelHeightToHeight
      var yRatio = Math.max(minYRatio, Math.min(maxYRatio, yRatio))

      this.xRatio = xRatio
      this.yRatio = yRatio

      this.transformIndicators()
      this.uiCanvas.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
   }

   centerCanvas() {
      this.xRatio = 0.5
      this.yRatio = 0.5

      this.transformIndicators()
      this.uiCanvas.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
   }

   fitCanvas() {
      // easel space
      var easelElement = this.bakedHTML.ele('easel')
      var easelRect = easelElement.getBoundingClientRect()

      // try to fit with
      var scale = 1

      scale = Math.min(
         Math.floor((easelRect.width - 40) / this.frameWidth * 100)/100,
         Math.floor((easelRect.height - 40) / this.frameHeight * 100)/100
      )

      this.setScale(scale)
   }

   transformIndicators() {
      var htmlIndicatorHorizontalTop = this.bakedHTML.ele('indicatorHT')
      var htmlIndicatorHorizontalBottom = this.bakedHTML.ele('indicatorHB')
      var htmlIndicatorVerticalLeft = this.bakedHTML.ele('indicatorVL')
      var htmlIndicatorVerticalRIght = this.bakedHTML.ele('indicatorVR')


      var x = Math.max(0, Math.min(this.xRatio*100, 100))
      var y = Math.max(0, Math.min(this.yRatio*100, 100))

      htmlIndicatorHorizontalTop.style.left = x + '%'
      htmlIndicatorHorizontalBottom.style.left = x + '%'
      htmlIndicatorVerticalLeft.style.top = y + '%'
      htmlIndicatorVerticalRIght.style.top = y + '%'
   }

   updateFrames({ width, height }) {
      this.frameWidth = width
      this.frameHeight = height
   }

   recipe() {
      return {
         name: 'easel',
         classes: ['easel'],
         events: {
            mousemove: this.eventMousemove.bind(this),
            mousedown: this.eventMousedown.bind(this),
            mouseup: this.eventMouseup.bind(this),
            mouseleave: this.eventMouseup.bind(this),
            wheel: this.eventScroll.bind(this)
         },
         append: [
            this.uiCanvas.bakedHTML,
            this.uiCursor.bakedHTML
         ],
         ingredients: [
            { name: 'indicatorHB', classes: ['indicator', 'horizontal'] },
            { name: 'indicatorHT', classes: ['indicator', 'horizontal', 'top'] },
            { name: 'indicatorVR', classes: ['indicator', 'vertical'] },
            { name: 'indicatorVL', classes: ['indicator', 'vertical', 'left'] },
         ]
      }
   }
}
