class Easel {
   constructor(options) {

      this.canvas = options.canvas
      this.cursor = options.cursor

      this.htmlCanvas = this.canvas.html
      this.htmlCursor = this.cursor.html
      this.onScale = options.onScale || function(){}

      this.mouse = {
         moving: false,
         pos: {
            x: 0,
            y: 0
         }
      }

      this.canvasX = 0
      this.canvasY = 0
      this.canvasMoveDampen = 2
      this.canvasScale = 1
      this.canvasScaleMax = 20
      this.canvasScaleMin = 0.1
      this.canvasScaleDampen = 100
      this.bakeHTML()
      this.centerCanvas()
   }

   eventMousedown(e, element) {
      var isLeftButton = e.button == 0
      var isMiddleButton = e.button == 1

      var canMoveEasel = isMiddleButton
      if(canMoveEasel) {
         this.mouse.moving = true
         e.stopPropagation()
      }
   }

   eventMouseup(e, element) {
      this.mouse.moving = false
      this.mouse.down = false
   }

   eventMousemove(e, element) {
      var deltaX = this.mouse.pos.x - e.clientX
      var deltaY = this.mouse.pos.y - e.clientY

      this.mouse.pos.x = e.clientX
      this.mouse.pos.y = e.clientY

      if (this.mouse.moving) {
         this.canvasX -= deltaX
         this.canvasY -= deltaY

         this.transformCanvasAndCursor()
         this.transformIndicators()
      }
   }

   eventScroll(e) {
      e.preventDefault()

      var isZoom = e.ctrlKey
      if(isZoom) {
         var newScale = this.canvasScale - e.deltaY/this.canvasScaleDampen
         var newScaleMinMax = Math.min(this.canvasScaleMax, Math.max(this.canvasScaleMin, newScale))
         var newScaleRounded = Math.round(newScaleMinMax*100)/100
         this.canvasScale = newScaleRounded
         this.onScale(newScaleRounded)
      } else {
         this.canvasX -= e.deltaX / this.canvasMoveDampen
         this.canvasY -= e.deltaY / this.canvasMoveDampen
      }

      this.transformCanvasAndCursor()
      this.transformIndicators()
   }

   centerCanvas() {
      var canvasRect = this.htmlCanvas.getBoundingClientRect()
      var cursorRect = this.htmlCursor.getBoundingClientRect()
      var scrollRect = this.htmlScroll.getBoundingClientRect()

      this.canvasX = (scrollRect.width / 2) - (canvasRect.width / 2)
      this.canvasY = (scrollRect.height / 2) - (canvasRect.height / 2)

      this.cursorX = (scrollRect.width / 2) - (cursorRect.width / 2)
      this.cursorY = (scrollRect.height / 2) - (cursorRect.height / 2)

      this.transformCanvasAndCursor()
      this.transformIndicators()
   }

   transformCanvasAndCursor() {
      var x = this.canvasX
      var y = this.canvasY
      var scale = this.canvasScale

      this.htmlCanvas.style.transform = `
        translateX(${x}px)
        translateY(${y}px)
        scale(${scale})
      `

      this.htmlCursor.style.transform = `
        translateX(${x}px)
        translateY(${y}px)
        scale(${scale})
      `
   }

   transformIndicators() {
      console.log('indicators')
      var x = this.canvasX + this.htmlCanvas.width/2
      var y = this.canvasY + this.htmlCanvas.height/2

      x = Math.max(0, Math.min(x, this.htmlScroll.clientWidth))
      y = Math.max(0, Math.min(y, this.htmlScroll.clientHeight))
      console.log(this.htmlIndicatorHorizontal, x, y)
      this.htmlIndicatorHorizontal.style.left = x + 'px'
      this.htmlIndicatorHorizontalTop.style.left = x + 'px'
      this.htmlIndicatorVertical.style.top = y + 'px'
      this.htmlIndicatorVerticalLeft.style.top = y + 'px'
   }

   bakeHTML() {
      var htmlBakeRecipe = [
         {
            classes: ['scroll'],
            events: {
               mousemove: this.eventMousemove.bind(this),
               mousedown: this.eventMousedown.bind(this),
               mouseup: this.eventMouseup.bind(this),
               mouseleave: this.eventMouseup.bind(this),
               mousewheel: this.eventScroll.bind(this)
            },
            append: [this.htmlCanvas, this.htmlCursor],
            children: [
               { classes: ['indicator', 'horizontal'] },
               { classes: ['indicator', 'horizontal', 'top'] },
               { classes: ['indicator', 'vertical'] },
               { classes: ['indicator', 'vertical', 'left'] },
            ]
         }
      ]

      var bakedHTML = app.bakeHTML(htmlBakeRecipe)
      this.html = bakedHTML.first()

      this.htmlScroll = this.html
      this.htmlIndicatorHorizontal = this.html.children[0]
      this.htmlIndicatorHorizontalTop = this.html.children[1]
      this.htmlIndicatorVertical = this.html.children[2]
      this.htmlIndicatorVerticalLeft = this.html.children[3]
   }
}
