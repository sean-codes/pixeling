class Canvas extends Base  {
   constructor(options) {
      super()

      this.initialScale = 1
      this.scale = this.initialScale

      this.framesList = []
      this.frameWidth = 0
      this.frameHeight = 0
      this.onion = 1

      this.bakeHTML()

      this.eleCanvasContainer = this.bakedHTML.ele('canvas')
      this.mainCanvas = this.bakedHTML.ele('canvas-main')
      this.mainCtx = this.mainCanvas.getContext('2d')
      this.tempCanvas = this.bakedHTML.ele('canvas-temp')
      this.tempCtx = this.tempCanvas.getContext('2d')

      this.selected = undefined
   }

   setFrames({ list, currentFrame, width, height }, selected) {
      this.framesList = list
      this.currentFrame = currentFrame
      this.frameWidth = width
      this.frameHeight = height
      this.selected = selected

      this.resetCanvas()
      this.drawFrame()
      this.drawSelected()
   }

   drawFrame() {
      // a bit all over the place. i need a nap
      var start = Math.max(0, this.currentFrame - this.onion)
      var totalDistance = (this.currentFrame - start + 1)
      var currentDistance = 1

      while(start <= this.currentFrame) {
         var opacity = currentDistance / totalDistance
         var frame = this.framesList[start]
         this.mainCtx.globalAlpha = opacity

         this.mainCtx.drawImage(frame.canvas, 0, 0)
         start += 1
         currentDistance += 1
      }
      this.mainCtx.globalAlpha = 1
   }

   resetCanvas() {
      var frame = this.framesList[this.currentFrame]
      this.mainCanvas.width = this.frameWidth
      this.mainCanvas.height = this.frameHeight
      this.tempCanvas.width = this.frameWidth
      this.tempCanvas.height = this.frameHeight
      this.drawCheckerBoard()
   }

   drawTemporary(temporaryCanvas) {
      this.tempCtx.clearRect(0, 0, this.frameWidth, this.frameHeight)
      this.tempCtx.drawImage(temporaryCanvas, 0, 0)
   }

   drawSelected() {
      var { selected } = this
      if (selected) {
         this.mainCtx.drawImage(selected.copy, selected.x, selected.y)
      }
   }

   drawPixel(pixel) {
      this.mainCtx.fillStyle = pixel.colorString
      this.mainCtx.fillRect(
         Math.floor(pixel.x*this.scale),
         Math.floor(pixel.y*this.scale),
         Math.ceil(this.scale),
         Math.ceil(this.scale)
      )
   }

   drawCheckerBoard() {
      var size = 16
      var spacesX = Math.ceil(this.frameWidth / size)
      var spacesY = Math.ceil(this.frameHeight / size)
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.mainCtx.fillStyle = (counter % 2 != 0) ? '#DDD' : '#BBB'
            this.mainCtx.fillRect(
               x*size,
               y*size,
               size,
               size
            )
            counter += 1
         }
         if(spacesY % 2 == 0) counter += 1
      }
   }

   updateCanvasPositionAndScale(xRatio, yRatio, scale) {
      var element = this.bakedHTML.ele('canvas')
      this.scale = scale
      element.style.width = (this.frameWidth * this.scale) + 'px'
      element.style.height = (this.frameHeight * this.scale) + 'px'
      element.style.left = (xRatio*100) + '%'
      element.style.top = (yRatio*100) + '%'
      element.style.transform =
         `translateX(-50%) translateY(-50%)`
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.resetCanvas()
      this.drawFrame()
   }

   recipe() {
      return {
         tag: 'div',
         name: 'canvas',
         classes: ['canvas-container'],
         ingredients: [
            {
               name: 'canvas-main',
               tag: 'canvas',
               classes: ['canvas'],
            },
            {
               name: 'canvas-temp',
               tag: 'canvas',
               classes: ['canvas'],
            }
         ]
      }
   }
}
