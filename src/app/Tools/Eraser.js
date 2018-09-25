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
      app.image.clearPixels({
         x: position.x,
         y: position.y,
         width: app.component.cursor.size,
         height: app.component.cursor.size
      })
   }
}
