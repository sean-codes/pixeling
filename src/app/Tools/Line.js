app.tools.line = new app.tools.Base({

   select() {
      console.log('selecting line tool')
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   down(mouse) {

   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      var start = mouse.positionStart
      var end = mouse.positionCurrent
      app.frames.temporaryClear()
      app.frames.temporaryAddPixels([start, end])
      app.updateTemporary()
   },

   up(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      app.frames.temporaryApply()
      app.updateFrames()
      app.history.push()
   },
})
