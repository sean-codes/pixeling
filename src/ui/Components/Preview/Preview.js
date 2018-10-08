class Preview extends Base {
   constructor() {
      super()
      this.bakeHTML()

      this.size = 200
   }

   toggle() {
      var elePreview = this.bakedHTML.ele('preview')
      elePreview.classList.toggle('hide')
   }

   setFrames(frames) {
      var bakedReel = this.bakedHTML.find('reel')
      bakedReel.clear()

      for(var frameID in frames) {
         var frame = frames[frameID]

         var bakedFrame = this.bake(this.recipeFrame(frameID))
         bakedReel.append(bakedFrame)

         this.updateFrame(frameID, frame)
      }
   }

   updateFrame(frameID, frame) {
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
            ctx.fillRect(x*scale, y*scale, scale, scale)
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
            if(counter % 2) ctx.fillRect(
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

   playFrames() {

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
