class Canvas extends Base  {
   constructor(options) {
      super()

      this.initialScale = 10
      this.scale = this.initialScale

      this.frames = []
      this.onion = 1

      this.bakeHTML()

      this.canvas = this.bakedHTML.ele('canvas')
      this.ctx = this.canvas.getContext('2d')
   }

   setFrames(currentFrame, frames) {
      this.frames = frames
      this.currentFrame = currentFrame

      this.resetCanvas()
      this.drawImage()
   }

   drawImage() {
      // a bit all over the place. i need a nap
      var start = Math.max(0, this.currentFrame - this.onion)
      var totalDistance = (this.currentFrame - start + 1)
      var currentDistance = 1

      while(start <= this.currentFrame) {
         var opacity = currentDistance / totalDistance
         var frame = this.frames[start]
         this.ctx.globalAlpha = opacity

         for(var x = 0; x < frame.width; x++) {
            for(var y = 0; y < frame.height; y++) {
               this.drawPixel(frame.pixels[x][y])
            }
         }
         start += 1
         currentDistance += 1
      }
      this.ctx.globalAlpha = 1
   }

   resetCanvas() {
      var frame = this.frames[this.currentFrame]
      this.canvas.width = frame.width*this.scale
      this.canvas.height = frame.height*this.scale
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawCheckerBoard()
   }

   temporaryPixels(temporaryPixels) {
      this.resetCanvas()
      this.drawImage()

      for(var pixel of temporaryPixels) {
         this.drawPixel(pixel)
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
      var frame = this.frames[this.currentFrame]

      var size = 16
      var spacesX = Math.ceil(frame.width / size)
      var spacesY = Math.ceil(frame.height / size)
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
            if(counter % 2 == 0) this.ctx.fillRect(
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
      this.drawImage()
   }

   recipe() {
      return {
         name: 'canvas',
         tag: 'canvas',
         classes: ['canvas']
      }
   }
}
