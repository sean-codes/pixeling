app.tools.line = {

   select() {
      console.log('selecting line tool')
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
      var xStart = start.x
      var yStart = start.y
      var xEnd = end.x
      var yEnd = end.y

      // hmm hypotnuse is multiply them with some squigly over
      var xLength = xEnd-xStart || 0.0001
      var yLength = yEnd-yStart || 0.0001
      var lineLength = Math.sqrt(xLength*xLength + yLength*yLength)

      // unit that vector ya
      var xUnit = 1 / (lineLength / xLength)
      var yUnit = 1 / (lineLength / yLength)

      // ok give me an array of pixels on the double
      var temporaryPixels = []

      while(
         (yUnit > 0 ? yStart <= yEnd : yEnd < yStart) ||
         (xUnit > 0 ? xStart <= xEnd : xEnd < xStart)
      ) {
         var xPos = Math.round(xStart) // lets try floor first.. then round if that isnt right
         var yPos = Math.round(yStart)

         temporaryPixels = temporaryPixels.concat(this.pixelsForCursor(xPos, yPos))

         xStart += xUnit
         yStart += yUnit
      }

      return temporaryPixels
   },

   pixelsForCursor(xPos, yPos) {
      var size = app.ui.cursor.size
      var xStart = xPos - Math.floor(size/2)
      var yStart = yPos - Math.floor(size/2)

      var temporaryPixels = []
      for(var x = xStart; x < xStart + size; x++) {
         for(var y = yStart; y < yStart + size; y++) {
            temporaryPixels.push({
               x,
               y,
               colorString: app.image.hslaToString(app.ui.pallet.color)
            })
         }
      }

      return temporaryPixels
   }
}
