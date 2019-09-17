app.frames = new class Frames {
   constructor() {
      this.list = []
      this.currentFrame = 0

      // for drawing / stamping
      this.temporaryCanvas = document.createElement('canvas')
      this.temporaryCtx = this.temporaryCanvas.getContext('2d')
      this.temporaryImageData = this.temporaryCtx.getImageData(0, 0, this.temporaryCanvas.width, this.temporaryCanvas.height)
      this.width = 0
      this.height = 0
   }

   create(width, height) {
      this.width = width
      this.height = height
      this.list = []
      this.currentFrame = 0
      this.addFrame()

      this.temporaryCanvas.width = this.width
      this.temporaryCanvas.height = this.height
   }

   load(image, frames=1) {
      var frameWidth = image.width/frames
      var frameHeight = image.height
      this.create(frameWidth, frameHeight)

      this.list[0].ctx.drawImage(image, 0, 0, frameWidth, frameHeight)

      for(var offset = 1; offset < frames; offset++) {
         this.addFrame()
         this.currentFrame = 0
         this.list[offset].ctx.drawImage(image, frameWidth*offset, frameHeight*offset, frameWidth, frameHeight)
      }
   }

   export() {
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
   }

   addFrame() {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = this.width
      canvas.height = this.height

      var frame = {
         canvas: canvas,
         ctx: ctx
      }

      this.list.push(frame)
   }

   deleteFrame(frameID) {
      if(this.list.length < 2) return

      var before = this.list.slice(0, frameID)
      var after = this.list.slice(frameID+1, this.list.length)
      var newFramesList = [ ...before, ...after ]

      // some reason this.currentFrame is not shortcutting
      if(this.currentFrame != 0 && this.currentFrame >= frameID) {
         this.currentFrame -= 1
      }
      this.list = newFramesList
   }

   setSize(width, height) {
      this.cropCanvas(0, 0, width, height)
   }

   crop(startX, startY, width, height) {
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

      this.dimensions.width = width
      this.dimensions.height = height
   }

   clearBetween([p1, p2]) {
      var pixels = app.util.pixelsBetweenPoints(p1, p2)
      for (var pixel of pixels) {
         console.log('clearing', pixel)
         this.clear({
            x: pixel.x - Math.floor(app.cursorSize/2),
            y: pixel.y - Math.floor(app.cursorSize/2),
            width: app.cursorSize,
            height: app.cursorSize
         })
      }
   }

   clear(area) {
      var frame = this.getCurrentFrame()
      console.log('clearing area', area)
      frame.ctx.clearRect(area.x, area.y, area.width, area.height)
   }

   temporaryApply() {
      var frame = this.getCurrentFrame()
      frame.ctx.drawImage(this.temporaryCanvas, 0, 0)
   }

   temporaryClear() {
      this.temporaryCtx.clearRect(0, 0, this.width, this.height)
      this.temporaryImageData = this.temporaryCtx.getImageData(0, 0, app.frames.width, app.frames.height)
   }

   temporaryAddPixels(positions) {
      // need to find a way to hide this.....
      var time = Date.now()
      var p1 = positions[positions.length - 1]
      var p2 = positions[positions.length - 2] || p1

      var size = app.cursorSize
      var pixels = app.util.pixelsBetweenPoints(p1, p2)

      // var temporaryImageData = this.temporaryCtx.getImageData(0, 0, app.frames.width, app.frames.height)
      var temporaryImageData = this.temporaryImageData
      for (var pixel of pixels) {
         var xStart = pixel.x - Math.floor(size/2)
         var xEnd = xStart + size

         for (var x = xStart; x < xEnd; x++) {
            var yStart = pixel.y - Math.floor(size/2)
            var yEnd = yStart + size

            for (var y = yStart; y < yEnd; y++) {
               if (x < 0 || x >= app.frames.width) continue
               if (y < 0 || y >= app.frames.height) continue
               var i = (app.frames.width * 4 * y) + (x * 4)

               temporaryImageData.data[i] = app.rgba.r
               temporaryImageData.data[i + 1] = app.rgba.g
               temporaryImageData.data[i + 2] = app.rgba.b
               temporaryImageData.data[i + 3] = app.rgba.a
            }
         }
      }

      // its possible to apply only that changed pixels
      var minX = Math.min(p1.x, p2.x) - app.cursorSize
      var minY = Math.min(p1.y, p2.y) - app.cursorSize
      var maxX = Math.max(p1.x, p2.x) + app.cursorSize * 2
      var maxY = Math.max(p1.y, p2.y) + app.cursorSize * 2
      var width = maxX - minX
      var height = maxY - minY

      app.frames.temporaryCtx.putImageData(temporaryImageData, 0, 0, minX, minY, width, height)
      console.log(Date.now() - time + 'ms')
   }

   readPixel(x, y) {
      var frame = this.getCurrentFrame()
      var pixelData = frame.ctx.getImageData(x, y, 1, 1)
      return app.util.rgbaToHsla(pixelData.data[0], pixelData.data[1], pixelData.data[2], pixelData.data[3])
   }

   getCurrentFrame() {
      return this.list[this.currentFrame]
   }
}
