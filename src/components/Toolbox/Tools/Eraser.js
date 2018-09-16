class ToolEraser {
   constructor() {
      this.size = 1
   }

   down(mouse) {
      this.erasePixelAtPosition(mouse.positionStart)
   }

   move(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
   }

   stroke(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
      this.erasePixelAtPosition(mouse.positionCurrent)
   }

   erasePixelAtPosition(position) {
      app.script.removePixel(position)
   }

   updateCursorPosition(position) {
      app.script.setCursor({
         x: position.x,
         y: position.y,
         width: this.size,
         height: this.size
      })
   }
}
