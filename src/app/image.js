app.image = {
   width: 48,
   height: 32,
   pixels: {},
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
         var percent = target.a

         // saturation = amout of hue to use. ( im making this up :] )
         var totalAlpha = target.a + original.a
         var targetSaturationPercent = target.a / totalAlpha
         var hueDifference = target.h - original.h

         // only add the saturation amount of target to color
         // if you had a color with 0 saturation the original hue would stay!
         var h = original.h + hueDifference * targetSaturationPercent
         var s = Math.ceil(original.s + (target.s - original.s) * percent)
         var l = Math.ceil(original.l + (target.l - original.l) * percent)
         var a = Math.min(1, original.a + target.a)

         return { h, s, l, a }
   },

   hslaToString: function(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   },

   pixelID(x, y) {
      return x + 'x' + y
   },
}
