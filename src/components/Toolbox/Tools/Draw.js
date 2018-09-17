class ToolDraw {
   constructor() {
      this.size = 1
      this.color = '#FFF'
   }

   down(mouse) {
      this.drawPixelAtPosition(mouse.positionStart)
   }

   move(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
   }

   stroke(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
      this.drawPixelAtPosition(mouse.positionCurrent)
   }

   drawPixelAtPosition(position) {
      app.script.updatePixel(position)
   }

   updateCursorPosition(position) {
      app.script.setCursor({
         x: position.x,
         y: position.y,
         width: this.size,
         height: this.size,
         color: '#000'
      })
   }
}
