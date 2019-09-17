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

      this.canvas = this.bakedHTML.ele('canvas')
      this.ctx = this.canvas.getContext('2d')
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
         this.ctx.globalAlpha = opacity

         this.ctx.drawImage(frame.canvas, 0, 0)
         start += 1
         currentDistance += 1
      }
      this.ctx.globalAlpha = 1
   }

   resetCanvas() {
      var frame = this.framesList[this.currentFrame]
      this.canvas.width = this.frameWidth
      this.canvas.height = this.frameHeight
      this.canvas.style.width = (this.frameWidth) + 'px'
      this.canvas.style.height = (this.frameHeight) + 'px'
      this.drawCheckerBoard()
   }

   drawTemporary(temporaryCanvas) {
      this.resetCanvas()
      this.drawFrame()

      this.ctx.drawImage(temporaryCanvas, 0, 0)
   }

   drawSelected() {
      var { selected } = this
      if (selected) {
         this.ctx.drawImage(selected.copy, selected.x, selected.y)
      }
   }

   drawPixel(pixel) {
      this.ctx.fillStyle = pixel.colorString
      this.ctx.fillRect(
         Math.floor(pixel.x*this.scale),
         Math.floor(pixel.y*this.scale),
         Math.ceil(this.scale),
         Math.ceil(this.scale)
      )
   }

   drawCheckerBoard() {
      var frame = this.framesList[this.currentFrame]

      var size = 16
      var spacesX = Math.ceil(this.frameWidth / size)
      var spacesY = Math.ceil(this.frameHeight / size)
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.ctx.fillStyle = (counter % 2 == 0) ? '#DDD' : '#CCC'
            this.ctx.fillRect(
               x*size*this.scale,
               y*size*this.scale,
               this.scale*size,
               this.scale*size
            )
            counter += 1
         }
         if(spacesY % 2 == 0) counter += 1
      }
   }

   updateCanvasPositionAndScale(x, y, scale) {
      var element = this.bakedHTML.ele('canvas')

      element.style.left = x + '%'
      element.style.top = y + '%'
      element.style.transform =
         `translateX(-50%) translateY(-50%) scale(${scale})`
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.resetCanvas()
      this.drawFrame()
   }

   recipe() {
      return {
         name: 'canvas',
         tag: 'canvas',
         classes: ['canvas']
      }
   }
}
