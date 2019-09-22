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

      this.moving = false // middle mouse
      this.gesturing = false // two touch
      this.drawing = false // one touch / missed gesture timeout
      this.mode = ''

      this.moveDampen = 2

      this.scale = 10

      this.scaleMin = 0.1
      this.scaleMax = 64
      this.scaleDampen = 100

      this.onPassEventMousedown = options.onPassEventMousedown || function() {}
      this.onPassEventMousemove = options.onPassEventMousemove || function() {}
      this.onPassEventMouseup = options.onPassEventMouseup || function() {}
      this.onPassEventMouseleave = options.onPassEventMouseleave || function() {}

      this.gestureDelay = 100
      this.timeoutGesture = undefined
      this.pointers = []

      this.changed = false
      this.changeInterval = setInterval(() => {
         if (this.changed) {
            this.transformIndicators()
            this.uiCanvas.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
            this.uiCursor.updateCanvasPositionAndScale(this.xRatio, this.yRatio, this.scale)
            this.changed = false
         }
      }, 1000/60)
   }

   eventMousedown(e) {
      var isMiddleButton = e.button == 1

      if(isMiddleButton) {
         this.mode = 'moving'
      }

      this.pointers.push({ e, moveX: 0, moveY: 0 })

      clearTimeout(this.timeoutGesture)
      this.timeoutGesture = setTimeout(() => {
         this.mode = 'cursor'
         this.onPassEventMousedown(e)
      }, this.gestureDelay)

      if (this.pointers.length == 2 && this.mode !== 'cursor') {
         clearTimeout(this.timeoutGesture)
         this.mode = 'gesturing'
      }
   }

   eventMouseup(e) {
      e.preventDefault()

      if (this.mode == '') {
         clearTimeout(this.timeoutGesture)
         this.onPassEventMousedown(e)
         this.onPassEventMouseup(e)
      }

      if (this.mode == 'cursor') {
         this.onPassEventMouseup(e)
      }

      this.pointers = this.pointers.filter(p => e.pointerId !== p.e.pointerId)

      if (!this.pointers.length) {
         this.mode = ''
      }
   }

   eventMousemove(e) {
      if (this.mode == 'cursor' || this.mode == '') {
         this.onPassEventMousemove(e)
      }

      if (this.mode == 'moving') {
         var moveX = e.movementX
         var moveY = e.movementY

         this.moveCanvas(moveX, moveY)
      }

      if (this.mode == 'gesturing' && this.pointers.length == 2) {
         var pointer0 = this.pointers.find(p => p.e.pointerId === e.pointerId)
         var pointer1 = this.pointers.find(p => p.e.pointerId !== e.pointerId)

         var diffX = e.offsetX - pointer1.e.offsetX
         var diffY = e.offsetY - pointer1.e.offsetY
         var oldDiffX = pointer0.e.offsetX - pointer1.e.offsetX
         var oldDiffY = pointer0.e.offsetY - pointer1.e.offsetY
         var distance = Math.sqrt(diffX*diffX + diffY*diffY)
         var oldDistance = Math.sqrt(oldDiffX*oldDiffX + oldDiffY*oldDiffY)
         var scale = (oldDistance - distance) * (this.scale/(this.scaleDampen*5))

         // move cursor between touch points
         var middleX = pointer0.e.offsetX - (diffX)/2
         var middleY = pointer0.e.offsetY - (diffY)/2
         this.uiCursor.onEventMousemove({ offsetX: middleX, offsetY: middleY })

         var moveX = 0
         var moveY = 0
         if (Math.sign(e.movementX) == Math.sign(pointer1.moveX)) {
            pointer0.moveX = 0
            pointer1.moveX = 0
            moveX = e.movementX
         } else {
            pointer0.moveX = e.movementX
         }

         if (Math.sign(e.movementY) == Math.sign(pointer1.moveY)) {
            pointer0.moveY = 0
            pointer1.moveY = 0
            moveY = e.movementY
         } else {
            pointer0.moveY = e.movementY
         }


         pointer0.e = e
         this.moveCanvas(moveX, moveY)
         this.zoom(scale)
      }
   }

   eventMouseleave(e) {
      // prevent double calling up/leave
      var pointer = this.pointers.find(p => e.pointerId == p.e.pointerId)
      if (pointer) {
         this.eventMouseup(e)
      }

      if (!this.gesturing) {
         this.onPassEventMouseleave(e)
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

      this.changed = true
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

      this.changed = true
   }

   centerCanvas() {
      this.xRatio = 0.5
      this.yRatio = 0.5

      this.changed = true
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
      let events = {
         mousemove: this.eventMousemove.bind(this),
         mouseleave: this.eventMouseleave.bind(this),
         mousedown: this.eventMousedown.bind(this),
         mouseup: this.eventMouseup.bind(this),
      }

      const supportsPointerEvents = PointerEvent ? true : false
      if (supportsPointerEvents) {
         events = {
            pointermove: this.eventMousemove.bind(this),
            pointerleave: this.eventMouseleave.bind(this),
            pointerdown: this.eventMousedown.bind(this),
            pointerup: this.eventMouseup.bind(this),
         }
      }

      events.wheel = this.eventScroll.bind(this)

      return {
         name: 'easel',
         classes: ['easel'],
         events: events,
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
