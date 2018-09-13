class Canvas {
   constructor(html) {
      this.html = html

      this.mouse = {
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
      this.mouse.down = true
   }

   eventMouseup(e, element) {
      this.mouse.down = false
   }

   eventMousemove(e, element) {
      var deltaX = this.mouse.pos.x - e.clientX
      var deltaY = this.mouse.pos.y - e.clientY

      this.mouse.pos.x = e.clientX
      this.mouse.pos.y = e.clientY

      if (this.mouse.down) {
         this.htmlScroll.parentElement.scrollLeft = this.htmlScroll.parentElement.scrollLeft + deltaX
         this.htmlScroll.parentElement.scrollTop = this.htmlScroll.parentElement.scrollTop + deltaY
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
            mousemove: (e, ele) => this.eventMousemove(e, ele),
            mousedown: (e, ele) => this.eventMousedown(e, ele),
            mouseup: (e, ele) => this.eventMouseup(e, ele),
            mouseout: (e, ele) => this.eventMouseup(e, ele),
            mousewheel: (e, ele) => this.eventScroll(e, ele)
         },
         children: [{
            tag: 'canvas'
         }]
      }]

      var bakedHTML = app.script.bakeHTML(htmlBakeRecipe)
      this.htmlScroll = bakedHTML.elements[0]
      this.htmlCanvas = this.htmlScroll.querySelector('canvas')

      bakedHTML.appendTo(this.html)
   }
}
