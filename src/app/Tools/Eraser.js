app.tools.eraser = {
   select() {
      app.script.setCursor({ fill: false, selected: false })
   },

   down(mouse) {
      app.script.erasePixelAtPosition(mouse.positionStart)
   },

   move(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
   },

   stroke(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
      app.script.erasePixelAtPosition(mouse.positionCurrent)
   },

   updateCursorPosition(position) {
      app.script.setCursor({
         x: position.x,
         y: position.y,
         width: this.size,
         height: this.size,
         fill: false
      })
   }
}
