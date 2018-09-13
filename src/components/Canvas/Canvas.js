class Canvas {
   constructor(html) {
      this.html = html
      this.bakeHTML()

      this.mouse = {
         down: false,
         pos: { x: 0, y: 0 }
      }
   }

   eventMousedown(e, element) {
      console.log('mouse down')
      this.mouse.down = true
   }

   eventMouseup(e, element) {
      console.log('mouse up')
      this.mouse.down = false
   }

   eventMousemove(e, element) {
      var deltaX = this.mouse.pos.x - e.clientX
      var deltaY = this.mouse.pos.y - e.clientY

      this.mouse.pos.x = e.clientX
      this.mouse.pos.y = e.clientY

      if(this.mouse.down) {
         console.log('moving')
         this.htmlScroll.parentElement.scrollLeft = this.htmlScroll.parentElement.scrollLeft + deltaX
         this.htmlScroll.parentElement.scrollTop = this.htmlScroll.parentElement.scrollTop + deltaY
      }
   }

   bakeHTML() {
      var htmlBakeRecipe = [{
         classes: ['scroll'],
         events: {
            mousemove: (e, ele) => this.eventMousemove(e, ele),
            mousedown: (e, ele) => this.eventMousedown(e, ele),
            mouseup: (e, ele) => this.eventMouseup(e, ele),
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
