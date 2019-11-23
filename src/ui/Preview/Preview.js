class Preview extends Base {
   constructor() {
      super()
      this.bakeHTML()

      this.elePreview = this.bakedHTML.ele('preview')
      this.eleCanvas = this.bakedHTML.ele('canvas')
      this.ctx = this.eleCanvas.getContext('2d')

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
      this.ctx.clearRect(0, 0, this.scaledWidth, this.scaledHeight)

      this.drawCheckedBackground()
      this.ctx.drawImage(
         this.frames[idToSetCurrent].canvas,
         0, 0, this.frameWidth, this.frameHeight,
         0, 0, this.scaledWidth, this.scaledHeight,
      )

      // draw selected
      if(idToSetCurrent === this.currentFrame && this.selected && this.selected.copy) {
         this.ctx.drawImage(
            this.selected.copy,
            this.selected.x*this.scale,
            this.selected.y*this.scale,
            this.selected.width * this.scale,
            this.selected.height * this.scale
         )
      }
   }

   setFrames({ list, width, height, currentFrame }, selected) {
      this.currentFrame = currentFrame
      this.frames = list
      this.frameWidth = width
      this.frameHeight = height
      this.selected = selected

      this.scale = this.size / Math.max(this.frameWidth, this.frameHeight)
      this.scaledWidth = this.frameWidth * this.scale
      this.scaledHeight = this.frameHeight * this.scale

      // update size
      this.elePreview.style.width = this.scaledWidth + 'px'
      this.elePreview.style.height = this.scaledHeight + 'px'

      // update canvas
      this.eleCanvas.width = this.scaledWidth
      this.eleCanvas.height = this.scaledHeight
      this.ctx.imageSmoothingEnabled = false

      this.setVisibleFrame(this.currentFrame)
   }

   drawCheckedBackground(scale) {
      var size = 16
      var spacesX = Math.ceil(this.eleCanvas.width / (size*this.scale))
      var spacesY = Math.ceil(this.eleCanvas.height / (size*this.scale))
      var counter = 0
      for(var x = 0; x < spacesX; x++) {
         for(var y = 0; y < spacesY; y++) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            if(counter % 2 == 0) this.ctx.fillRect(
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

   recipe() {
      return {
         classes: ['ui', 'preview', 'hide'],
         name: 'preview',
         ingredients: [
            {
               name: 'canvas',
               tag: 'canvas'
            }
         ]
      }
   }
}
