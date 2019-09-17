class Easel extends Base  {
   constructor(options) {
      super()

      this.uiCanvas = options.uiCanvas
      this.uiCursor = options.uiCursor

      this.bakeHTML()

      this.onScale = options.onScale || function(){}

      this.centerX = 0
      this.centerY = 0

      this.moving = false
      this.moveDampen = 2

      this.scale = 10

      this.scaleMin = 0.1
      this.scaleMax = 100
      this.scaleDampen = 10
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
         this.zoom(e.deltaY/this.scaleDampen)
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

      this.setScale(newScaleRounded)
   }

   setScale(scale) {
      this.scale = scale
      this.onScale(this.scale)

      this.uiCanvas.updateCanvasPositionAndScale(this.centerX, this.centerY, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.centerX/100, this.centerY/100, this.scale)
   }

   moveCanvas(moveX, moveY) {
      var easelElement = this.bakedHTML.ele('easel')
      var canvasElement = this.bakedHTML.ele('canvas')
      this.centerX += (moveX / easelElement.clientWidth)*100
      this.centerY += (moveY / easelElement.clientHeight)*100

      this.transformIndicators()
      this.uiCanvas.updateCanvasPositionAndScale(this.centerX, this.centerY, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.centerX/100, this.centerY/100, this.scale)
   }

   setCanvas(centerX, centerY) {
      this.centerX = centerX
      this.centerY = centerY

      this.transformIndicators()
      this.uiCanvas.updateCanvasPositionAndScale(this.centerX, this.centerY, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.centerX/100, this.centerY/100, this.scale)
   }

   centerCanvas() {
      this.centerX = 50
      this.centerY = 50

      this.transformIndicators()
      this.uiCanvas.updateCanvasPositionAndScale(this.centerX, this.centerY, this.scale)
      this.uiCursor.updateCanvasPositionAndScale(this.centerX/100, this.centerY/100, this.scale)
   }

   fitCanvas() {
      // easel space
      var easelElement = this.bakedHTML.ele('easel')
      var canvasElement = this.bakedHTML.ele('canvas')

      var easelRect = easelElement.getBoundingClientRect()
      var canvasRect = canvasElement.getBoundingClientRect()

      var scale = (easelRect.height - 30) / canvasRect.height * 10
      this.setScale(scale)
   }

   transformIndicators() {
      var easelElement = this.bakedHTML.ele('easel')
      var htmlIndicatorHorizontalTop = this.bakedHTML.ele('indicatorHT')
      var htmlIndicatorHorizontalBottom = this.bakedHTML.ele('indicatorHB')
      var htmlIndicatorVerticalLeft = this.bakedHTML.ele('indicatorVL')
      var htmlIndicatorVerticalRIght = this.bakedHTML.ele('indicatorVR')


      var x = Math.max(0, Math.min(this.centerX, 100))
      var y = Math.max(0, Math.min(this.centerY, 100))

      htmlIndicatorHorizontalTop.style.left = x + '%'
      htmlIndicatorHorizontalBottom.style.left = x + '%'
      htmlIndicatorVerticalLeft.style.top = y + '%'
      htmlIndicatorVerticalRIght.style.top = y + '%'
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
