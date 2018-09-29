class Easel extends Base  {
   constructor(options) {
      super()

      this.uiCanvas = options.canvas
      this.uiCursor = options.cursor
      this.onScale = options.onScale || function(){}

      this.moving = false

      this.centerX = 0
      this.centerY = 0
      this.moveDampen = 2

      this.scale = 1
      this.scaleMin = 0.1
      this.scaleMax = 20
      this.scaleDampen = 100

      this.createHTML()

      this.bakedHTML.append(this.uiCanvas.bakedHTML)
      this.bakedHTML.append(this.uiCursor.bakedHTML)
   }

   eventMousedown(e, element) {
      console.log('wtf')
      var isMiddleButton = e.button == 1

      if(isMiddleButton) {
         this.moving = true
      }
   }

   eventMouseup(e, element) {
      this.moving = false
   }

   eventMousemove(e, element) {
      console.log(e.movementX, e.movementY)
      if (this.moving) {
         this.centerX += e.movementX
         this.centerY += e.movementY

         this.transformCanvasCanvas()
         this.transformCursorCanvas()
         this.transformIndicators()
      }
   }

   eventScroll(e) {
      e.preventDefault()

      var isZoom = e.ctrlKey
      if(isZoom) {
         var newScale = this.scale - e.deltaY/this.scaleDampen
         var newScaleMinMax = Math.min(this.scaleMax, Math.max(this.scaleMin, newScale))
         var newScaleRounded = Math.round(newScaleMinMax*100)/100
         this.scale = newScaleRounded
         this.onScale(newScaleRounded)
      } else {
         this.centerX -= e.deltaX / this.moveDampen
         this.centerY -= e.deltaY / this.moveDampen
      }

      this.transformCanvasCanvas()
      this.transformCursorCanvas()
      this.transformIndicators()
   }

   centerCanvas() {
      var easelElement = this.bakedHTML.ele('easel')

      this.centerX = easelElement.clientWidth / 2
      this.centerY = easelElement.clientHeight / 2

      this.transformCanvasCanvas()
      this.transformCursorCanvas()
      this.transformIndicators()
   }

   transformCanvasCanvas() {
      var uiCanvasElement = this.uiCanvas.bakedHTML.ele('canvas')
      var x = this.centerX - uiCanvasElement.clientWidth / 2
      var y = this.centerY - uiCanvasElement.clientHeight / 2

      uiCanvasElement.style.transform = `
        translateX(${x}px)
        translateY(${y}px)
        scale(${this.scale})
      `
   }

   transformCursorCanvas() {
      var uiCursorElement = this.uiCursor.bakedHTML.ele('canvas')
      var x = this.centerX - uiCursorElement.clientWidth / 2
      var y = this.centerY - uiCursorElement.clientHeight / 2

      uiCursorElement.style.transform = `
         translateX(${x}px)
         translateY(${y}px)
         scale(${this.scale})
      `
   }

   transformIndicators() {
      var easelElement = this.bakedHTML.ele('easel')
      var htmlIndicatorHorizontalTop = this.bakedHTML.ele('indicatorHT')
      var htmlIndicatorHorizontalBottom = this.bakedHTML.ele('indicatorHB')
      var htmlIndicatorVerticalLeft = this.bakedHTML.ele('indicatorVL')
      var htmlIndicatorVerticalRIght = this.bakedHTML.ele('indicatorVR')


      var x = Math.max(0, Math.min(this.centerX, easelElement.clientWidth))
      var y = Math.max(0, Math.min(this.centerY, easelElement.clientHeight))

      htmlIndicatorHorizontalTop.style.left = x + 'px'
      htmlIndicatorHorizontalBottom.style.left = x + 'px'
      htmlIndicatorVerticalLeft.style.top = y + 'px'
      htmlIndicatorVerticalRIght.style.top = y + 'px'
   }

   createHTML() {
      var htmlBakeRecipe = {
         name: 'easel',
         classes: ['easel'],
         events: {
            mousemove: this.eventMousemove.bind(this),
            mousedown: this.eventMousedown.bind(this),
            mouseup: this.eventMouseup.bind(this),
            mouseleave: this.eventMouseup.bind(this),
            mousewheel: this.eventScroll.bind(this)
         },
         append: [this.uiCanvas.bakedHTML, this.uiCursor.bakedHTML],
         ingredients: [
            { name: 'indicatorHB', classes: ['indicator', 'horizontal'] },
            { name: 'indicatorHT', classes: ['indicator', 'horizontal', 'top'] },
            { name: 'indicatorVR', classes: ['indicator', 'vertical'] },
            { name: 'indicatorVL', classes: ['indicator', 'vertical', 'left'] },
         ]
      }

      this.bakedHTML = this.bakeHTML(htmlBakeRecipe)
   }
}
