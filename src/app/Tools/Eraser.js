app.tools.eraser = new app.tools.Base({
   hint: 'shortcut: e',
   select() {
      app.ui.cursor.update({ mode: 'erase' })
   },

   down(mouse) {
      this.erase(mouse)
   },

   up(mouse) {
      app.history.push()
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      this.erase(mouse)
   },

   erase(mouse) {
      app.frames.clearBetween([
         mouse.positionLast,
         mouse.positionCurrent
      ])

      app.updateFrames()
   },
})
