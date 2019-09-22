app.tools.rectangle = new app.tools.Base({
   select() {
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

      this.applyTemporaryPixels(start, end)
   },

   up(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      app.frames.temporaryApply()
      app.frames.temporaryClear()
      app.updateFrames()
      app.history.push()
   },

   applyTemporaryPixels(start, end) {
      var size = app.ui.cursor.size
      var topLeft = { x: start.x, y: start.y }
      var topRight = { x: end.x, y: start.y }
      var bottomLeft = { x: start.x, y: end.y }
      var bottomRight = { x: end.x, y: end.y }

      var pixels = []
      app.frames.temporaryClear()
      app.frames.temporaryAddPixels([topLeft, topRight])
      app.frames.temporaryAddPixels([topRight, bottomRight])
      app.frames.temporaryAddPixels([bottomLeft, bottomRight])
      app.frames.temporaryAddPixels([topLeft, bottomLeft])
      app.updateTemporary()
   }
})
