class Preview extends Base {
   constructor() {
      super()
      this.bakeHTML()

      this.size = 200
      this.looping = false
      this.loopInterval = 100
      this.loopTimeout = undefined
      this.loopFrame = 0
      this.frames = []
      this.currentFrame = 0
      this.frameWidth = 0
      this.frameHeight = 0
   }

   toggle() {
      var elePreview = this.bakedHTML.ele('preview')
      elePreview.classList.toggle('hide')
   }

   togglePreviewLoop() {
      if(this.looping) {
         this.looping = false
         clearTimeout(this.loopTimeout)
         this.setVisibleFrame(this.currentFrame)
      } else {
         this.looping = !this.looping
         this.loop()
      }
   }

   loop() {
      this.loopFrame += 1
      if(this.loopFrame >= this.frames.length) this.loopFrame = 0
      this.setVisibleFrame(this.loopFrame)

      if (this.looping) {
         this.loopTimeout = setTimeout(() => {
            this.loop()
         }, this.loopInterval)
      }
   }

   setVisibleFrame(idToSetCurrent) {
      for(var frameID in this.frames) {
         var eleCanvas = this.bakedHTML.ele('frame_'+frameID)
         eleCanvas.classList.toggle('current', idToSetCurrent == frameID)
      }
   }

   setFrames({ list, width, height, currentFrame }, selected) {
      this.currentFrame = currentFrame
      this.frames = list
      this.frameWidth = width
      this.frameHeight = height
      var bakedReel = this.bakedHTML.find('reel')
      bakedReel.clear()

      for(var frameID in this.frames) {
         var frame = this.frames[frameID]
         var bakedFrame = this.bake(this.recipeFrame(frameID, frame.canvas))
         bakedReel.append(bakedFrame)
         this.updateFrame(frameID, selected)
      }
   }

   updateFrame(frameID, selected) {
      var frame = this.frames[frameID]
      var eleReel = this.bakedHTML.ele('reel')
      var eleCanvas = this.bakedHTML.ele('frame_'+frameID)

      var ctx = eleCanvas.getContext('2d')
      var scale = this.size / Math.max(this.frameWidth, this.frameHeight)
      var width = this.frameWidth * scale
      var height = this.frameHeight * scale
      eleCanvas.width = width
      eleCanvas.height = height
      eleReel.style.width = width + 'px'
      eleReel.style.height = height + 'px'
      ctx.imageSmoothingEnabled = false

      this.drawCheckedBackground(ctx, scale)
      ctx.drawImage(frame.canvas, 0, 0, width, height)

      // selected, i know this function is dense :<
      if(frameID != this.currentFrame || !selected || !selected.copy) return
      ctx.drawImage(selected.copy, selected.x*scale, selected.y*scale, selected.width * scale, selected.height * scale)
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

   recipeFrame(id, canvas) {
      return {
         tag: 'canvas',
         name: 'frame_'+id
      }
   }
}
