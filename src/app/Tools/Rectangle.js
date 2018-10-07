app.tools.rectangle = {
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
      var temporaryPixels = this.buildTemporaryPixels(start, end)
      app.ui.canvas.temporaryPixels(temporaryPixels)
   },

   up(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      var start = mouse.positionStart
      var end = mouse.positionCurrent
      var temporaryPixels = this.buildTemporaryPixels(start, end)

      for(var pixel of temporaryPixels) {
         app.frames.drawPixel(pixel.x, pixel.y, app.ui.pallet.getColor())
      }
      app.ui.canvas.updateImage(app.frames.getCurrentFrame())
      app.history.push()
   },

   buildTemporaryPixels(start, end) {
      var size = app.ui.cursor.size
      var topLeft = { x: start.x, y: start.y }
      var topRight = { x: end.x, y: start.y }
      var bottomLeft = { x: start.x, y: end.y }
      var bottomRight = { x: end.x, y: end.y }

      var pixels = []
      pixels.push(...app.magic.pixelsBetweenPoints(topLeft, topRight, size))
      pixels.push(...app.magic.pixelsBetweenPoints(topRight, bottomRight, size))
      pixels.push(...app.magic.pixelsBetweenPoints(bottomLeft, bottomRight, size))
      pixels.push(...app.magic.pixelsBetweenPoints(topLeft, bottomLeft, size))

      return app.magic.removeCollidingPixels(pixels)
   }
}
