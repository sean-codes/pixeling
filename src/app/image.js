app.image = {
   width: 48,
   height: 32,
   pixels: {},
   ctx: document.createElement('canvas').getContext('2d'),
   transparentColor: function() {
      return { h: 0, s: 0, l: 0, a: 0 }
   },
   load: function(image) {
      this.create(image.width, image.height)

      // loop through new image pixels
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)

      for(var x = 0; x < image.width; x++) {
         for(var y = 0; y < image.height; y++) {
            var pixelData = ctx.getImageData(x, y, 1, 1).data
            var hslaColor = this.rgbaToHsla(...pixelData)
            this.drawPixel(x, y, hslaColor)
         }
      }
   },
   export: function() {
      var canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height

      var ctx = canvas.getContext('2d')

      this.loopPixels((pixel) => {
         ctx.fillStyle = this.hslaToString(pixel.color)
         ctx.fillRect(pixel.x, pixel.y, 1, 1)
      })

      return canvas.toDataURL()
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
      var color = app.ui.pallet.getColor()

      this.loopPixels((pixel) => {
         app.image.drawPixel(pixel.x, pixel.y, color)
      }, area.x, area.y, area.width, area.height)

      app.ui.canvas.updateImage(app.image)
   },

   drawPixel: function(x, y, color) {
      if(!app.image.pixels[x] || !app.image.pixels[x][y]) return
      
      var pixel = app.image.pixels[x][y]
      pixel.color = app.image.addHSLColor(pixel.color, color)
      pixel.colorString = app.image.hslaToString(pixel.color)
   },

   clearPixels: function(area) {
      this.loopPixels((pixel) => {
         app.image.pixels[pixel.x][pixel.y] = this.createPixel(pixel.x, pixel.y)
      }, area.x, area.y, area.width, area.height)

      app.ui.canvas.updateImage(app.image)
   },

   loopPixels: function(run, areaX=0, areaY=0, width=this.width, height=this.height) {
      for(var x = areaX; x < areaX+width; x++) {
         for(var y = areaY; y < areaY+height; y++) {
            this.pixels[x] && this.pixels[x][y] && run(this.pixels[x][y])
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

   hslaToRgba: function(h, s, l, a) {
      this.ctx.clearRect(0, 0, 1, 1)
      this.ctx.fillStyle = this.hslaToString({ h, s, l, a})
      this.ctx.fillRect(0, 0, 1, 1)

      var [r, g, b, a] = this.ctx.getImageData(0, 0, 1, 1).data
      return {r, g, b, a}
   },

   rgbaToHsla: function(r, g, b, a) {
      // help me <3
      r /= 255, g /= 255, b /= 255, a /= 255

      var min = Math.min(r, g, b), max = Math.max(r, g, b)
      var h=0, s=0, l = (min+max) / 2, d = max-min

      if(!d) return { h, s, l: l*100, a }

      s = l < 0.5 ? d / (max+min) : d / (2-max-min)
      var dR = (((max-r) / 6) + (d/2)) / d
      var dG = (((max-g) / 6) + (d/2)) / d
      var dB = (((max-b) / 6) + (d/2)) / d

      h = r==max ? dB-dG : g==max ? (1/3)+dR-dB : (2/3)+dG-dR
      h = h<0 ? h+1 : h>1 ? h-1 : h
      return {
         h: Math.round(h*360*10)/10,
         s: Math.round(s*100),
         l: Math.round(l*100),
         a: Math.round(a*100)/100
      }
   },

   hslaToString: function(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   },

   pixelID(x, y) {
      return x + 'x' + y
   },
}
