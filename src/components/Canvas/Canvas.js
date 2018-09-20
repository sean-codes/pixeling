class Canvas {
   constructor(options) {
      this.createCanvas()
      this.image = options.image

      this.initialScale = 10
      this.scale = this.initialScale
      this.htmlCanvas.width = this.image.width*this.scale
      this.htmlCanvas.height = this.image.height*this.scale

      this.resetCanvas()
      this.renderImage()
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.resetCanvas()
      this.renderImage()
   }

   updateImage(image) {
      this.image = JSON.parse(JSON.stringify(image))
      this.resetCanvas()
      this.renderImage()
   }

   renderImage() {
      for(var pixelID in this.image.pixels) {
         var pixel = this.image.pixels[pixelID]
         this.ctx.fillStyle = pixel.colorString
         this.ctx.fillRect(
            Math.floor(pixel.position.x*this.scale),
            Math.floor(pixel.position.y*this.scale),
            Math.ceil(this.scale),
            Math.ceil(this.scale)
         )
      }
   }

   resetCanvas() {
      this.htmlCanvas.width = this.image.width*this.scale
      this.htmlCanvas.height = this.image.height*this.scale
      this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height)
      this.drawCheckerBoard()
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

   createCanvas() {
      var htmlBakeRecipe = [{
         tag: 'canvas',
         classes: ['canvas']
      }]

      var bakedHTML = app.bakeHTML(htmlBakeRecipe)
      this.htmlCanvas = bakedHTML.elements[0]
      this.ctx = this.htmlCanvas.getContext('2d')
   }
}
