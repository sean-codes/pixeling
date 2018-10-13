app.frames = {
   list: [],
   currentFrame: 0,
   width: 48,
   height: 32,
   ctx: document.createElement('canvas').getContext('2d'),
   getCurrentFrame: function() {
      return this.list[this.currentFrame]
   },

   transparentColor: function() {
      return { h: 0, s: 0, l: 0, a: 0 }
   },

   load: function(image, frames=1) {
      var frameWidth = image.width/frames
      var frameHeight = image.height
      this.create(frameWidth, frameHeight)

      // loop through new image pixels
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)

      for(var offset = 0; offset < frames; offset++) {
         if(offset){
            this.addFrame()
            this.currentFrame = this.list.length-1
         }

         for(var x = 0; x < frameWidth; x++) {
            for(var y = 0; y < frameHeight; y++) {
               var pixelData = ctx.getImageData(x+(offset*frameWidth), y, 1, 1).data
               var hslaColor = this.rgbaToHsla(...pixelData)
               this.drawPixel(x, y, hslaColor)
            }
         }
      }
   },

   export: function() {
      var canvas = document.createElement('canvas')
      canvas.width = this.width * this.list.length
      canvas.height = this.height

      var ctx = canvas.getContext('2d')
      var offX = 0

      for(var frame of this.list) {
         for(var x = 0; x < frame.width; x++) {
            for(var y = 0; y < frame.height; y++) {
               var pixel = frame.pixels[x][y]
               ctx.fillStyle = this.hslaToString(pixel.color)
               ctx.fillRect(pixel.x + offX, pixel.y, 1, 1)
            }
         }
         offX += frame.width
      }

      return canvas.toDataURL()
   },

   create: function(width, height) {
      this.width = width
      this.height = height
      this.list = []
      this.currentFrame = 0
      this.addFrame()
   },

   addFrame: function() {
      var frame = {
         width: this.width,
         height: this.height,
         pixels: this.createPixelsArray(this.width, this.height)
      }

      this.list.push(frame)
   },

   deleteFrame: function(frameID) {
      if(this.list.length < 2) return

      var before = this.list.slice(0, frameID)
      var after = this.list.slice(frameID+1, this.list.length)
      var newFramesList = [ ...before, ...after ]

      // some reason this.currentFrame is not shortcutting
      if(this.currentFrame != 0 && this.currentFrame >= frameID) {
         this.currentFrame -= 1
      }
      this.list = newFramesList
   },

   createPixelsArray: function(width, height) {
      var pixels = []

      for(var x = 0; x < width; x++) {
         pixels[x] = []
         for(var y = 0; y < height; y++) {
            pixels[x][y] = this.createPixel(x, y)
         }
      }

      return pixels
   },

   createPixel: function(x, y) {
      return {
         x, y,
         color: this.transparentColor(),
         colorString: this.hslaToString(this.transparentColor())
      }
   },

   setCanvasSize: function(width, height) {
      var oldWidth = this.width
      var oldHeight = this.height

      for(var frame of this.list) {
         var oldPixels = app.clone(frame.pixels)
         var newPixels = this.createPixelsArray(width, height)

         for(var x = 0; x < oldWidth; x++) {
            for(var y = 0; y < oldHeight; y++) {
               if(oldPixels[x] && oldPixels[x][y] && newPixels[x] && newPixels[x][y]) {
                  newPixels[x][y] = oldPixels[x][y]
               }
            }
         }

         frame.pixels = newPixels
         frame.width = width
         frame.height = height
      }
   },


   drawPixels: function(pixels) {
      for(var pixel of pixels) {
         this.drawPixel(pixel.x, pixel.y, pixel.color)
      }
   },

   drawPixel: function(x, y, color) {
      var image = this.getCurrentFrame()
      if(!image.pixels[x] || !image.pixels[x][y]) return

      var pixel = image.pixels[x][y]
      pixel.color = this.addHSLColor(pixel.color, color)
      pixel.colorString = this.hslaToString(pixel.color)
   },

   clearPixels: function(area) {
      var image = this.getCurrentFrame()
      this.loopPixels((pixel) => {
         image.pixels[pixel.x][pixel.y] = this.createPixel(pixel.x, pixel.y)
      }, area.x, area.y, area.width, area.height)
   },

   loopPixels: function(run, areaX=0, areaY=0, width=this.width, height=this.height) {
      var image = this.getCurrentFrame()

      for(var x = areaX; x < areaX+width; x++) {
         for(var y = areaY; y < areaY+height; y++) {
            image.pixels[x] && image.pixels[x][y] && run(image.pixels[x][y])
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

   getImageRect() {
      return { x: 0, y: 0, width: this.width, height: this.height}
   },

   pixelID(x, y) {
      return x + 'x' + y
   }
}
