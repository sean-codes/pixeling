class Preview extends Base {
   constructor() {
      super()
      this.bakeHTML()

      this.size = 200
      this.looping = false
      this.currentFrame = 0
      this.loopInterval = 100
      this.loopFrame = 0
   }

   toggle() {
      var elePreview = this.bakedHTML.ele('preview')
      elePreview.classList.toggle('hide')
   }

   togglePreviewLoop() {
      if(this.looping) {
         this.looping = false
         this.setVisibleFrame(this.currentFrame)
      } else {
         this.looping = !this.looping
         this.loop()
      }

   }

   loop() {
      this.loopFrame += 1
      if(this.loopFrame == this.frames.length) this.loopFrame = 0
      this.setVisibleFrame(this.loopFrame)

      this.looping && setTimeout(() => {
         this.loop()
      }, this.loopInterval)
   }

   setVisibleFrame(idToSetCurrent) {
      this.currentFrame = idToSetCurrent
      for(var frameID in this.frames) {
         var eleCanvas = this.bakedHTML.ele('frame_'+frameID)
         eleCanvas.classList.toggle('current', idToSetCurrent == frameID)
      }
   }

   setFrames(frames, selected) {
      if(frames.length <= this.loopCurrent) {
         this.loopCurrent = 0
      }
      this.frames = frames
      var bakedReel = this.bakedHTML.find('reel')
      bakedReel.clear()

      for(var frameID in frames) {
         var frame = frames[frameID]

         var bakedFrame = this.bake(this.recipeFrame(frameID))
         bakedReel.append(bakedFrame)

         this.updateFrame(frameID, frame, selected)
      }
   }

   updateFrame(frameID, frame, selected) {
      var eleReel = this.bakedHTML.ele('reel')
      var eleCanvas = this.bakedHTML.ele('frame_'+frameID)

      var ctx = eleCanvas.getContext('2d')
      var scale = this.size / Math.max(frame.width, frame.height)
      var width = frame.width * scale
      var height = frame.height * scale
      eleCanvas.width = width
      eleCanvas.height = height
      eleReel.style.width = width + 'px'
      eleReel.style.height = height + 'px'

      this.drawCheckedBackground(ctx, scale)

      for(var x = 0; x < frame.width; x++) {
         for(var y = 0; y < frame.height; y++) {
            var pixel = frame.pixels[x][y]
            ctx.fillStyle = pixel.colorString
            ctx.fillRect(
               Math.floor(x*scale),
               Math.floor(y*scale),
               Math.ceil(scale),
               Math.ceil(scale))
         }
      }

      // selected, i know this function is dense :<
      if(frameID != this.currentFrame || !selected || !selected.copy) return
      for(var x = 0; x < selected.width; x++) {
         for(var y = 0; y < selected.height; y++) {
            var pixel = selected.copy.pixels[x][y]

            ctx.fillStyle = pixel.colorString
            ctx.fillRect(
               Math.floor((selected.x + x)*scale),
               Math.floor((selected.y + y)*scale),
               Math.ceil(scale),
               Math.ceil(scale))
         }
      }
   }

   drawCheckedBackground(ctx, scale) {
      var size = 16
      var spacesX = Math.ceil(ctx.canvas.width / (size*scale))
      var spacesY = Math.ceil(ctx.canvas.height / (size*scale))
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            if(counter % 2 == 0) ctx.fillRect(
               x*size*scale,
               y*size*scale,
               scale*size,
               scale*size
            )
            counter += 1
         }
         if(spacesY % 2 == 0) counter += 1
      }
   }

   recipe() {
      return {
         classes: ['ui', 'preview'],
         name: 'preview',
         ingredients: [
            {
               name: 'reel',
               classes: ['reel']
            }
         ]
      }
   }

   recipeFrame(id) {
      return {
         tag: 'canvas',
         name: 'frame_'+id
      }
   }
}
