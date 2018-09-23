app.tools.eraser = {
   select() {
      app.component.cursor.update({ mode: 'erase' })
   },

   down(mouse) {
      this.erase(mouse.positionStart)
   },

   move(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
      this.erase(mouse.positionCurrent)
   },

   erase(position) {
      var size = app.component.cursor.size
      for(var x = 0; x < size; x++) {
         for(var y = 0; y < size; y++) {
            app.image.erasePixel({
               x: position.x + x,
               y: position.y + y
            })
         }
      }
   }
}
