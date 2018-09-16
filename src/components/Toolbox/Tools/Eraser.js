class ToolEraser {
   constructor() {
      this.size = 1
   }

   select() {
      app.script.setColor('rgba(0, 0, 0, 0)')
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
      app.script.setPixel(position)
   }

   updateCursorPosition(position) {
      app.script.setCursor({
         x: position.x,
         y: position.y,
         width: this.size,
         height: this.size,
         color: 'rgba(0, 0, 0, 0)'
      })
   }
}
