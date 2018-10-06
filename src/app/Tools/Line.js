app.tools.line = {

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
      var temporaryPixels = this.buildTemporaryPixels(start, end)
      app.ui.canvas.temporaryPixels(temporaryPixels)
   },

   up(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      var start = mouse.positionStart
      var end = mouse.positionCurrent
      var temporaryPixels = this.buildTemporaryPixels(start, end)

      for(var pixel of temporaryPixels) {
         app.image.drawPixel(pixel.x, pixel.y, app.ui.pallet.getColor())
      }
      app.ui.canvas.updateImage(app.image)
      app.history.push()
   },

   buildTemporaryPixels(start, end) {
      var size = app.ui.cursor.size
      return app.magic.pixelsBetweenPoints(start, end, size)
   },

}
