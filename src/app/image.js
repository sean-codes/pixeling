app.image = {
   width: 48,
   height: 32,
   pixels: {},
   ctx: document.createElement('canvas').getContext('2d'),
   transparentColor: function() {
      return { h: 0, s: 0, l: 0, a: 0 }
   },
   create: function(width, height) {
      var pixels = []

      for(var x = 0; x < width; x++) {
         pixels[x] = []
         for(var y = 0; y < height; y++) {
            pixels[x][y] = this.createPixel(x, y)
         }
      }

      app.image.width = width
      app.image.height = height
      app.image.pixels = pixels
   },

   createPixel: function(x, y) {
      return {
         x, y,
         color: this.transparentColor(),
         colorString: this.hslaToString(this.transparentColor())
      }
   },

   drawPixels: function(area) {
      var color = app.component.pallet.getColor()

      this.loopPixels(area, app.image.pixels, (pixel) => {
         pixel.color = app.image.addHSLColor(pixel.color, color)
         pixel.colorString = app.image.hslaToString(pixel.color)
      })

      app.component.canvas.updateImage(app.image)
   },

   clearPixels: function(area) {
      this.loopPixels(area, app.image.pixels, (pixel) => {
         app.image.pixels[pixel.x][pixel.y] = this.createPixel(pixel.x, pixel.y)
      })

      app.component.canvas.updateImage(app.image)
   },

   loopPixels: function(area, pixels, run, direction) {
      var direction = {
         x: direction ? direction.x || 1 : 1,
         y: direction ? direction.y || 1 : 1
      }

      var dirX = Math.sign(direction.x)
      var dirY = Math.sign(direction.y)
      var startX = dirX < 0 ? area.x : area.x + area.width-1
      var startY = dirY < 0 ? area.y : area.y + area.height-1
      var endX = dirX < 0 ? area.x + area.width : area.x
      var endY = dirY < 0 ? area.y + area.height : area.y

      for(var x = startX; (dirX < 0 ? x < endX : x >= endX); x -= dirX) {
         for(var y = startY; (dirY < 0 ? y < endY : y >= endY); y -= dirY) {
            pixels[x] && pixels[x][y] && run(pixels[x][y])
         }
      }
   },

   addHSLColor: function(original, target) {
      // could not really figure this one out
      // will cheat for now :]
      this.ctx.clearRect(0, 0, 1, 1)
      this.ctx.fillStyle = this.hslaToString(original)
      this.ctx.fillRect(0, 0, 1, 1)

      this.ctx.fillStyle = this.hslaToString(target)
      this.ctx.fillRect(0, 0, 1, 1)

      return this.rgbaToHsla(...this.ctx.getImageData(0, 0, 1, 1).data)
   },

   rgbaToHsla: function(r, g, b, a) {
      // help me <3
      r /= 255, g /= 255, b /= 255, a /= 255

      var min = Math.min(r, g, b), max = Math.max(r, g, b)
      var h=0, s=0, l, d = max-min

      l = (min+max) / 2
      if(!d) return { h, s, l: l*100, a }

      s = l < 0.5 ? d / (max+min) : d / (2-max-min)
      var dR = (((max-r) / 6) + (d/2)) / d
      var dG = (((max-g) / 6) + (d/2)) / d
      var dB = (((max-b) / 6) + (d/2)) / d

      h = r==max ? dB-dG : g==max ? (1/3)+dR-dB : (2/3)+dG-dR
      h = h<0 ? h+1 : h>1 ? h-1 : h
      return { h: h*360, s: s*100, l: l*100, a }
   },

   hslaToString: function(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   },

   pixelID(x, y) {
      return x + 'x' + y
   },
}
