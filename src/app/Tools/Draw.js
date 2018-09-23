app.tools.draw = {

   select() {
      app.component.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      this.drawPixelAtPosition(mouse.positionStart)
   },

   move(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
   },

   stroke(mouse) {
      this.updateCursorPosition(mouse.positionCurrent)
      this.drawPixelAtPosition(mouse.positionCurrent)
   },

   drawPixelAtPosition(position) {
      var size = app.component.cursor.size
      for(var x = 0; x < size; x++) {
         for(var y = 0; y < size; y++) {
            app.image.updatePixel({
               x: position.x + x,
               y: position.y + y
            })
         }
      }
   },

   updateCursorPosition(position) {
      app.component.cursor.update(position)
   },
}
