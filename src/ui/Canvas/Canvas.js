class Canvas {
   constructor(options) {
      this.createCanvas()
      this.canvas = this.html.find('canvas')
      console.log(this.canvas)
      this.ctx = this.canvas.getContext('2d')

      this.image = options.image

      this.initialScale = 10
      this.scale = this.initialScale
      this.html.width = this.image.width*this.scale
      this.html.height = this.image.height*this.scale

      this.resetCanvas()
   }

   updateScale(scale) {
      this.scale = this.initialScale * scale
      this.resetCanvas()
      this.drawImage()
   }

   updateImage(image) {
      this.image = image
      this.resetCanvas()
      this.drawImage()
   }

   drawImage() {

      var dimensions = { x: 0, y: 0, width: this.image.width, height: this.image.height }
      this.image.loopPixels(dimensions, this.image.pixels, (pixel) => {
         this.ctx.fillStyle = pixel.colorString
         this.ctx.fillRect(
            Math.floor(pixel.x*this.scale),
            Math.floor(pixel.y*this.scale),
            Math.ceil(this.scale),
            Math.ceil(this.scale)
         )
      })
   }

   resetCanvas() {
      this.html.width = this.image.width*this.scale
      this.html.height = this.image.height*this.scale
      this.ctx.clearRect(0, 0, this.html.width, this.html.height)
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
         name: 'canvas',
         tag: 'canvas',
         classes: ['canvas']
      }]

      this.html = app.bakeHTML(htmlBakeRecipe)
   }
}
