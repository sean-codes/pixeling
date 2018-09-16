class ToolEraser {
   constructor() {
      this.size = 1
   }

   colorChange() {
      app.global.color = 'rgba(0, 0, 0, 0)'
   }

   down(mouse) {
      this.erasePixelAtPosition(mouse.positionStart)
   }

   move(mouse) {
      app.global.color = 'rgba(0, 0, 0, 0)'
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
