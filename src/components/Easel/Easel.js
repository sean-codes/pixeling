class Easel {
   constructor(html, options) {
      this.html = html
      this.htmlCanvas = options.canvas.htmlCanvas

      this.mouse = {
         moving: false,
         down: false,
         pos: {
            x: 0,
            y: 0
         }
      }

      this.canvasX = 0
      this.canvasY = 0
      this.canvasMoveDampen = 2
      this.canvasScale = 1
      this.canvasScaleMax = 5
      this.canvasScaleMin = 0.1
      this.canvasScaleDampen = 100
      this.bakeHTML()
      this.centerCanvas()
   }

   eventMousedown(e, element) {
      var isLeftButton = e.button == 1
      var isMiddleButton = e.button == 1

      if(isMiddleButton) this.mouse.moving = true
      if(isLeftButton) this.mouse.down = true
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

         this.transformCanvas()
      }
   }

   eventScroll(e) {
      var isZoom = e.ctrlKey
      if(isZoom) {
         this.canvasScale -= e.deltaY/this.canvasScaleDampen
         this.canvasScale = Math.min(this.canvasScaleMax, Math.max(this.canvasScaleMin, this.canvasScale))
      } else {
         this.canvasX -= e.deltaX / this.canvasMoveDampen
         this.canvasY -= e.deltaY / this.canvasMoveDampen
      }

      this.transformCanvas()
   }

   centerCanvas() {
      var canvasRect = this.htmlCanvas.getBoundingClientRect()
      var scrollRect = this.htmlScroll.getBoundingClientRect()

      this.canvasX = (scrollRect.width / 2) - (canvasRect.width / 2)
      this.canvasY = (scrollRect.height / 2) - (canvasRect.height / 2)

      this.transformCanvas()
   }

   transformCanvas() {
      var x = this.canvasX
      var y = this.canvasY
      var scale = this.canvasScale
      this.htmlCanvas.style.transform = `
        translateX(${x}px)
        translateY(${y}px)
        scale(${scale})
      `
   }

   bakeHTML() {
      var htmlBakeRecipe = [{
         classes: ['scroll'],
         events: {
            mousemove: this.eventMousemove.bind(this),
            mousedown: this.eventMousedown.bind(this),
            mouseup: this.eventMouseup.bind(this),
            mouseleave: this.eventMouseup.bind(this),
            mousewheel: this.eventScroll.bind(this)
         },
         append: [this.htmlCanvas]
      }]

      var bakedHTML = app.script.bakeHTML(htmlBakeRecipe)
      this.htmlScroll = bakedHTML.elements[0]
      this.htmlCanvas = this.htmlScroll.querySelector('canvas')
      bakedHTML.appendTo(this.html)
   }
}
