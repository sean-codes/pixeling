app.frames = {
   list: [],
   currentFrame: 0,
   width: 48,
   height: 32,
   temporaryCanvas: document.createElement('canvas'),
   moveCanvas: document.createElement('canvas'),

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

      this.list[0].ctx.drawImage(image, 0, 0, frameWidth, frameHeight)

      for(var offset = 1; offset < frames; offset++) {
         this.addFrame()
         this.currentFrame = 0
         this.list[offset].ctx.drawImage(image, frameWidth*offset, frameHeight*offset, frameWidth, frameHeight)
      }
   },

   export: function() {
      var canvas = document.createElement('canvas')
      canvas.width = this.width * this.list.length
      canvas.height = this.height

      var ctx = canvas.getContext('2d')
      var offX = 0

      for(var frame of this.list) {
         ctx.drawImage(frame.canvas, offX, 0)
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
      var canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      var ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      var frame = {
         width: this.width,
         height: this.height,
         canvas: canvas,
         ctx: ctx
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
      this.cropCanvas(0, 0, width, height)
   },

   cropCanvas: function(startX, startY, width, height) {
      for(var frame of this.list) {
         var oldCanvas = frame.canvas
         frame.canvas = document.createElement('canvas')
         frame.ctx = frame.canvas.getContext('2d')
         frame.canvas.width = width
         frame.canvas.height = height
         frame.width = width
         frame.height = height

         frame.ctx.drawImage(oldCanvas, 0, 0)
      }

      this.width = width
      this.height = height
   },

   drawPixels: function(pixels) {
      for(var pixel of pixels) {
         this.drawPixel(pixel.x, pixel.y, pixel.color)
      }
   },

   drawPixel: function(x, y, color) {
      var frame = this.getCurrentFrame()
      frame.ctx.fillStyle = this.hslaToString(color)
      frame.ctx.fillRect(x, y, 1, 1)
   },

   clearPixels: function(area) {
      var frame = this.getCurrentFrame()
      frame.ctx.clearRect(area.x, area.y, area.width, area.height)
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

   getImageRect: function() {
      return { x: 0, y: 0, width: this.width, height: this.height}
   },

   pixelID: function(x, y) {
      return x + 'x' + y
   },

   readPixel: function(frame, x, y) {
      // console.log('readingPixel', frame, x, y)
      var pixelData = frame.ctx.getImageData(x, y, 1, 1)
      // console.log('pixelData', pixelData)
      return this.rgbaToHsla(pixelData.data[0], pixelData.data[1], pixelData.data[2], pixelData.data[3])
   },

   setTemporary: function() {
      var frame = this.getCurrentFrame()
      this.temporaryCanvas.width = frame.width
      this.temporaryCanvas.height = frame.height
      this.temporaryCanvas.getContext('2d').drawImage(frame.canvas, 0, 0)
   },

   restoreTemporary: function() {
      var frame = this.getCurrentFrame()
      frame.ctx.clearRect(0, 0, frame.width, frame.height)
      frame.ctx.drawImage(this.temporaryCanvas, 0, 0)
   },

   movePixelArea: function(from, to) {
      var frame = this.getCurrentFrame()
      this.moveCanvas.width = from.width
      this.moveCanvas.height = from.height
      this.moveCanvas.getContext('2d').drawImage(
         frame.canvas,
         from.x, from.y, from.width, from.height,
         0, 0, from.width, from.height)

      frame.ctx.clearRect(from.x, from.y, from.width, from.height)
      frame.ctx.drawImage(this.moveCanvas, to.x, to.y)
   }
}
