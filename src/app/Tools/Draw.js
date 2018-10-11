app.tools.draw = new app.tools.Base({
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      this.temp(mouse.positions)
   },

   up(mouse) {
      this.draw(mouse.positions)
      app.history.push()
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      this.temp(mouse.positions)
   },

   temp(positions) {
      var pixels = this.pixelsBetweenPositions(positions)
      app.ui.canvas.temporaryPixels(pixels)
   },

   draw(positions) {
      var pixels = this.pixelsBetweenPositions(positions)
      app.frames.drawPixels(pixels)

      app.updateFrame()
   },

   pixelsBetweenPositions(positions) {
      var size = app.ui.cursor.size
      var pixels = []
      var lastPos = positions[0]
      for(var position of positions) {
         pixels.push(...this.utility.pixelsBetweenPoints(lastPos, position, size))
         lastPos = position
      }

      return this.utility.removeCollidingPixels(pixels)
   }
})
