class Frames extends Base {
   constructor(options = {}) {
      super()
      this.bakeHTML()

      this.callAddFrame = options.addFrame || function(){}
      this.callDeleteFrame = options.deleteFrame || function(){}
      this.callSelectFrame = options.selectFrame || function(){}
      this.callMoveFrame = options.moveFrame || function(){}


      this.size = 80
      this.frames = []
      this.frameWidth = 0
      this.frameHeight = 0
      this.framesLength = 0
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

   eventDeleteButton(e, bakeHtml) {
      e.stopPropagation()
      this.deleteFrame(Number(bakeHtml.data('id')))
   }

   eventMoveFrameLeft(e, bakeHtml) {
      e.stopPropagation()
      this.moveFrame(Number(bakeHtml.data('id')), -1)
   }

   eventMoveFrameRight(e, bakeHtml) {
      e.stopPropagation()
      this.moveFrame(Number(bakeHtml.data('id')), 1)
   }

   eventAddButton(e, bakeHtml) {
      e.stopPropagation()
      this.addFrame()
   }

   eventClickFrame(e, bakeHtml) {
      e.stopPropagation()
      var selectID = bakeHtml.data('id')
      this.selectFrame(selectID)
   }

   eventMouseDown(e) {
      this.mouse.down = true
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
   }

   eventMouseUp(e) {
      this.mouse.down = false
   }

   eventMouseMove(e) {
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

   deleteFrame(frameID) {
      this.callDeleteFrame(frameID)
   }

   moveFrame(frameId, direction) {
      if (frameId == 0 && direction < 0
         || frameId == this.frames.length-1 && direction > 0
      ) return
      this.selectFrame(frameId + direction)
      this.callMoveFrame(frameId, direction)
   }

   setFrames({ list, width, height, currentFrame }, selected, all) {
      var bakedReel = this.bakedHTML.find('reel')
      var needToRebuildHTML = this.framesLength != list.length
      if(needToRebuildHTML) bakedReel.clear()

      this.currentFrame = Number(currentFrame)
      this.frameWidth = width
      this.frameHeight = height
      this.frames = list
      this.selected = selected

      for(var frameID = 0; frameID < this.frames.length; frameID++) {
         var frame = this.frames[frameID]

         if(needToRebuildHTML) {
            var recipeFrame = this.recipeFrame(frameID)
            bakedReel.append(this.bake(recipeFrame))
            this.updateFrame(frameID)
         }

         var eleFrame = this.bakedHTML.ele('frame_'+frameID)
         eleFrame.classList.toggle('current', frameID == currentFrame)

         if (frameID === this.currentFrame || all) {
            this.updateFrame(frameID)
         }
      }

      this.framesLength = this.frames.length
   }

   updateFrame(frameId) {
      var frame = this.frames[frameId]
      var eleCanvas = this.bakedHTML.ele('canvas_'+frameId)
      this.drawFramePreview(eleCanvas, frame, frameId)
   }

   drawFramePreview(eleCanvas, frame, frameID) {
      var scale = this.size / Math.max(frame.width, frame.height)
      eleCanvas.width = this.frameWidth
      eleCanvas.height = this.frameHeight

      if (this.frameWidth >= this.frameHeight) {
         eleCanvas.style.width = '100%'
         eleCanvas.style.height = 'auto'
      } else {
         eleCanvas.style.width = 'auto'
         eleCanvas.style.height = '100%'
      }

      var ctx = eleCanvas.getContext('2d')
      ctx.clearRect(0, 0, this.frameWidth, this.frameHeight)
      ctx.drawImage(frame.canvas, 0, 0)

      var thisFrameCouldHaveSelectedContet = frameID == this.currentFrame
      var somethingIsSelected = this.selected && this.selected.copy

      if(thisFrameCouldHaveSelectedContet && somethingIsSelected) {
         ctx.drawImage(this.selected.copy, this.selected.x, this.selected.y, this.selected.width, this.selected.height)
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
         name: 'frame_'+id,
         ingredients: [
            {
               name: 'canvas_'+id,
               tag: 'canvas'
            },
            {
               classes: ['buttons'],
               ingredients: [
                  {
                     data: { id: id },
                     classes: ['button', 'delete'],
                     innerHTML: '+',
                     events: {
                        click: this.eventDeleteButton.bind(this)
                     }
                  },
                  {
                     data: { id: id },
                     classes: ['button', 'move-left'],
                     innerHTML: '',
                     events: {
                        click: this.eventMoveFrameLeft.bind(this)
                     }
                  },
                  {
                     data: { id: id },
                     classes: ['button', 'move-right'],
                     innerHTML: '',
                     events: {
                        click: this.eventMoveFrameRight.bind(this)
                     }
                  }
               ]
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
