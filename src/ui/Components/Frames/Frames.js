class Frames extends Base {
   constructor(options = {}) {
      super()
      this.bakeHTML()

      this.callAddFrame = options.addFrame || function(){}
      this.callSelectFrame = options.selectFrame || function(){}

      this.size = 80
      this.framesOffsetX = 0
      this.mouse = {
         down: false,
         x: undefined,
         y: undefined
      }
   }

   toggle() {
      var eleContainer = this.bakedHTML.ele('container')
      eleContainer.classList.toggle('hide')
   }

   nextFrame(){
      var nextFrame = this.currentFrame + 1
      if(nextFrame == this.frames.length) nextFrame = 0
      this.selectFrame(nextFrame)
   }

   eventAddButton(e, bakeHTML) {
      e.stopPropagation()
      this.addFrame()
   }

   eventClickFrame(e, bakedHTML) {
      e.stopPropagation()
      var selectID = bakedHTML.data('id')
      this.selectFrame(selectID)
   }

   eventMouseDown(e, bakedHTML) {
      this.mouse.down = true
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
   }

   eventMouseUp(e, bakedHTML) {
      this.mouse.down = false
   }

   eventMouseMove(e, bakedHTML) {
      if(!this.mouse.down) return

      var deltaX = e.clientX - this.mouse.x
      var deltaY = e.clientY - this.mouse.y

      this.mouse.x = e.clientX
      this.mouse.y = e.clientY

      this.scrollFrames(deltaX)
   }

   selectFrame(id) {
      this.currentFrame = id
      this.callSelectFrame(id)
   }

   addFrame() {
      this.callAddFrame()
   }

   setFrames(frames, current) {
      this.frames = frames
      this.currentFrame = current

      var bakedReel = this.bakedHTML.find('reel')
      bakedReel.clear()

      for(var frameID in frames) {
         var frame = frames[frameID]
         var recipeFrame = this.recipeFrame(frameID)
         if(frameID == current) {
            recipeFrame.classes.push('current')
         }

         var bakedFrame = this.bake(recipeFrame)
         bakedReel.append(bakedFrame)

         this.updateFrame(frameID, frame)
      }
   }

   updateFrame(frameID, frame) {
      var eleCanvas = this.bakedHTML.ele('canvas_'+frameID)
      console.log('updating frame', frameID, eleCanvas)

      this.drawFramePreview(eleCanvas, frame)
   }

   drawFramePreview(eleCanvas, frame) {
      var scale = this.size / Math.max(frame.width, frame.height)
      eleCanvas.width = frame.width * scale
      eleCanvas.height = frame.height * scale

      var ctx = eleCanvas.getContext('2d')
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

   scrollFrames(x) {
      var eleFrames = this.bakedHTML.ele('frames')
      var eleReel = this.bakedHTML.ele('reel')
      // move reel and keep within bounds
      this.framesOffsetX += x
      this.framesOffsetX = Math.max(this.framesOffsetX, -(eleReel.clientWidth - eleFrames.clientWidth))
      this.framesOffsetX = Math.min(0, this.framesOffsetX)
      var eleFrames = this.bakedHTML.ele('reel')
      eleFrames.style.transform = `translateX(${this.framesOffsetX}px)`
   }

   recipe() {
      return {
         name: 'container',
         classes: ['ui', 'frames', 'hide'],
         ingredients: [
            {
               name: 'frames',
               classes: ['frames'],
               ingredients: [
                  {
                     name: 'reel',
                     classes: ['reel']
                  }
               ],
               events: {
                  mousedown: this.eventMouseDown.bind(this),
                  mouseup: this.eventMouseUp.bind(this),
                  mouseleave: this.eventMouseUp.bind(this),
                  mousemove: this.eventMouseMove.bind(this)
               }
            },
            {
               classes: ['new'],
               ingredients: [
                  {
                     classes: ['btn'],
                     events: {
                        click: this.eventAddButton.bind(this)
                     }
                  }
               ]
            }
         ]
      }
   }

   recipeFrame(id) {
      return {
         classes: ['frame'],
         ingredients: [
            {
               name: 'canvas_'+id,
               tag: 'canvas'
            }
         ],
         data: {
            id: id
         },
         events: {
            click: this.eventClickFrame.bind(this)
         }
      }
   }
}
