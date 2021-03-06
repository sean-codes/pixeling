app.tools.draw = new app.tools.Base({
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {

      app.frames.temporaryClear()
      app.frames.temporaryAddPixels(mouse.positions)
      app.updateTemporary()
   },

   up(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      app.frames.temporaryAddPixels(mouse.positions)
      app.frames.temporaryApply()
      app.frames.temporaryClear()
      app.updateFrames()
      app.history.push()
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      app.frames.temporaryAddPixels(mouse.positions)
      app.updateTemporary()
   },
})
