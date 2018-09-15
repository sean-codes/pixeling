class Cursor {
   constructor() {
      this.position = { x: 0, y: 0 }
      this.size = {
         width: 1,
         height: 1
      }
      this.scale = 1
      this.createCursorCanvas()
      this.renderCursor()
   }

   update(options) {
      this.position = {
         x: options.x,
         y: options.y
      }

      this.size = {
         width: options.width,
         height: options.height
      }

      this.renderCursor()
   }

   updateScale(scale) {
      this.scale = scale
      this.renderCursor()
   }

   renderCursor() {
      var cursorScale = 10
      this.htmlCanvas.width = app.image.width*cursorScale
      this.htmlCanvas.height = app.image.height*cursorScale

      var x = Math.floor(this.position.x*cursorScale)
      var y = Math.floor(this.position.y*cursorScale)
      this.ctx.fillRect(x, y, cursorScale, cursorScale)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      this.ctx.strokeRect(x-0.5, y-0.5, cursorScale+1, cursorScale+1)
   }

   createCursorCanvas() {
      this.htmlCanvas = app.script.bakeHTML([
         {
            tag: 'canvas',
            classes: ['cursor']
         }
      ]).first()

      this.ctx = this.htmlCanvas.getContext('2d')
   }
}
