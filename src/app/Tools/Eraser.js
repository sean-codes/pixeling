app.tools.eraser = {
   select() {
      app.script.setCursor({ mode: 'erase' })
   },

   down(mouse) {
      this.erase(mouse.positionStart)
   },

   move(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
   },

   stroke(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
      this.erase(mouse.positionCurrent)
   },

   erase(position) {
      var size = app.component.cursor.size
      for(var x = 0; x < size; x++) {
         for(var y = 0; y < size; y++) {
            app.script.erasePixelAtPosition({
               x: position.x + x,
               y: position.y + y
            })
         }
      }
   },

   updateCursorPosition(position) {
      app.script.setCursor({
         x: position.x,
         y: position.y,
         width: this.size,
         height: this.size
      })
   }
}
