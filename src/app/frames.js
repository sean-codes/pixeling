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

   load(image, frameCount=1) {
      // currently only support opening horizontal frames
      var frameWidth = image.width/frameCount
      var frameHeight = image.height
      this.create(frameWidth, frameHeight)

      for (var frameId = 0; frameId < frameCount; frameId++) {
         // add frames for ones after first
         if (frameId) this.addFrame()

         // draw the frame from image
         this.list[frameId].ctx.drawImage(
            image,
            frameWidth*frameId, 0, frameWidth, frameHeight,
            0, 0, frameWidth, frameHeight
         )
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

   moveFrame(frameId, direction) {
      if (frameId === 0 && direction < 0) return
      if (frameId === this.list.length-1 && direction > 0) return

      var saveFrame = this.list[frameId]
      this.list[frameId] = this.list[frameId + direction]
      this.list[frameId + direction] = saveFrame
   }

   setSize(width, height) {
      this.crop(0, 0, width, height)
   }

   crop(startX, startY, width, height) {
      for(var frame of this.list) {
         var oldCanvas = frame.canvas
         frame.canvas = document.createElement('canvas')
         frame.ctx = frame.canvas.getContext('2d')
         frame.canvas.width = width
         frame.canvas.height = height

         frame.ctx.drawImage(oldCanvas, startX, startY, width, height, 0, 0, width, height)
      }

      this.width = width
      this.height = height

      this.temporaryCanvas.width = this.width
      this.temporaryCanvas.height = this.height
   }

   clearBetween([p1, p2]) {
      var frame = this.getCurrentFrame()
      var frameImageData = frame.ctx.getImageData(0, 0, this.width, this.height)

      var pixels = app.util.pixelsBetweenPoints(p1, p2)
      var size = app.cursorSize

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

               frameImageData.data[i] = 0
               frameImageData.data[i + 1] = 0
               frameImageData.data[i + 2] = 0
               frameImageData.data[i + 3] = 0
            }
         }
      }

      frame.ctx.putImageData(frameImageData, 0, 0)
   }

   clear(area) {
      var frame = this.getCurrentFrame()
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
      var p1 = positions[positions.length - 1]
      var p2 = positions[positions.length - 2] || p1

      var size = app.cursorSize
      var pixels = app.util.pixelsBetweenPoints(p1, p2)

      // need to apply this to canvas temp draw also
      var minX = Math.min(p1.x, p2.x) - Math.floor(app.cursorSize / 2)
      var minY = Math.min(p1.y, p2.y) - Math.floor(app.cursorSize / 2)
      var maxX = Math.max(p1.x, p2.x) + app.cursorSize
      var maxY = Math.max(p1.y, p2.y) + app.cursorSize
      var width = maxX - minX
      var height = maxY - minY

      var temporaryImageData = this.temporaryCtx.getImageData(minX, minY, width, height)

      for (var pixel of pixels) {
         var xStart = pixel.x - minX - Math.floor(size/2)
         var xEnd = xStart + size
         for (var x = xStart; x < xEnd; x++) {
            var yStart = pixel.y - minY - Math.floor(size/2)
            var yEnd = yStart + size

            for (var y = yStart; y < yEnd; y++) {
               var i = (width * 4 * y) + (x * 4)

               temporaryImageData.data[i] = app.rgba.r
               temporaryImageData.data[i + 1] = app.rgba.g
               temporaryImageData.data[i + 2] = app.rgba.b
               temporaryImageData.data[i + 3] = app.rgba.a
            }
         }
      }

      this.temporaryCtx.putImageData(temporaryImageData, minX, minY)
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
