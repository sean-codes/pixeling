app.tools.eraser = {
   hint: 'shortcut: e',
   select() {
      app.ui.cursor.update({ mode: 'erase' })
   },

   down(mouse) {
      this.erase(mouse.positionStart)
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      this.erase(mouse.positionCurrent)
   },

   erase(position) {
      app.image.clearPixels({
         x: position.x,
         y: position.y,
         width: app.ui.cursor.size,
         height: app.ui.cursor.size
      })
   }
}
