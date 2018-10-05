class Canvas extends Base  {
   constructor(options) {
      super()

      this.image = options.image
      this.initialScale = 10
      this.scale = this.initialScale


      this.bakeHTML()

      this.canvas = this.bakedHTML.ele('canvas')
      this.canvas.width = this.image.width*this.scale
      this.canvas.height = this.image.height*this.scale

      this.ctx = this.canvas.getContext('2d')
      this.resetCanvas()
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.resetCanvas()
      this.drawImage()
   }

   updateImage(image) {
      this.image = image || this.image
      this.resetCanvas()
      this.drawImage()
   }

   drawImage() {
      var dimensions = { x: 0, y: 0, width: this.image.width, height: this.image.height }
      this.image.loopPixels((pixel) => {
         this.drawPixel(pixel)
      })
   }

   resetCanvas() {
      this.canvas.width = this.image.width*this.scale
      this.canvas.height = this.image.height*this.scale
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
      var size = 16
      var spacesX = Math.ceil(this.image.width / size)
      var spacesY = Math.ceil(this.image.height / size)
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            if(counter % 2) this.ctx.fillRect(
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

   recipe() {
      return {
         name: 'canvas',
         tag: 'canvas',
         classes: ['canvas']
      }
   }
}
