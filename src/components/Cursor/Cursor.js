class Cursor {
   constructor() {
      this.x = 0
      this.y = 0
      this.width = 1
      this.height = 1
      this.scale = 1

      this.selected = undefined

      this.createCursorCanvas()
      this.renderCursor()

   }

   update(options) {
      for(var option in options) {
         this[option] = options[option]
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

      var x = Math.floor(this.x*cursorScale)
      var y = Math.floor(this.y*cursorScale)
      this.ctx.fillStyle = app.global.color
      this.ctx.fillRect(x, y, cursorScale, cursorScale)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      this.ctx.strokeRect(x+0.5, y+0.5, cursorScale-1, cursorScale-1)
      this.renderSelected()
   }

   renderSelected() {
      if(!this.selected) return
      var cursorScale = 10
      var x = Math.floor(this.selected.x*cursorScale)
      var y = Math.floor(this.selected.y*cursorScale)
      var width = Math.floor(this.selected.width*cursorScale)
      var height = Math.floor(this.selected.height*cursorScale)
      this.ctx.lineWidth = 4

      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.strokeRect(x+this.ctx.lineWidth/2, y+this.ctx.lineWidth/2, width-this.ctx.lineWidth, height-this.ctx.lineWidth)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      this.ctx.setLineDash([9]);
      this.ctx.strokeRect(x+this.ctx.lineWidth/2, y+this.ctx.lineWidth/2, width-this.ctx.lineWidth, height-this.ctx.lineWidth)
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
