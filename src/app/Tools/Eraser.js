app.tools.eraser = {
   hint: 'shortcut: e',
   select() {
      app.ui.cursor.update({ mode: 'erase' })
   },

   down(mouse) {
      this.erase(mouse.positionStart)
   },

   up(mouse) {
      app.history.push()
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      this.erase(mouse.positionCurrent)
      app.updateFrame()
   },

   erase(position) {
      app.frames.clearPixels({
         x: Math.ceil(position.x - app.ui.cursor.size/2),
         y: Math.ceil(position.y - app.ui.cursor.size/2),
         width: app.ui.cursor.size,
         height: app.ui.cursor.size
      })
   },
}
