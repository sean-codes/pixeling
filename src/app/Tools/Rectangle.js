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

      var xDir = Math.sign(xEnd - xStart)
      var yDir = Math.sign(yEnd - yStart)

      var temporaryPixels = []

      console.log(xStart, xEnd, xDir)
      // top line
      var xTemp = xStart
      var yTemp = yStart
      while(xDir > 0 ? xTemp <= xEnd : (xTemp >= xEnd && xDir != 0)) {
         temporaryPixels.push({
            x: xTemp,
            y: yTemp,
            colorString: app.image.hslaToString(app.ui.pallet.color)
         })

         xTemp += xDir
      }

      // bottom line
      var xTemp = xStart
      var yTemp = yEnd
      while(xDir > 0 ? xTemp <= xEnd : (xTemp >= xEnd && xDir != 0)) {
         temporaryPixels.push({
            x: xTemp,
            y: yTemp,
            colorString: app.image.hslaToString(app.ui.pallet.color)
         })

         xTemp += xDir
      }

      // left line
      var xTemp = xStart
      var yTemp = yStart
      while(yDir > 0 ? yTemp <= yEnd : (yTemp >= yEnd && yDir != 0)) {
         temporaryPixels.push({
            x: xTemp,
            y: yTemp,
            colorString: app.image.hslaToString(app.ui.pallet.color)
         })

         yTemp += yDir
      }

      // right line
      var xTemp = xEnd
      var yTemp = yStart
      while(yDir > 0 ? yTemp <= yEnd : (yTemp >= yEnd && yDir != 0)) {
         temporaryPixels.push({
            x: xTemp,
            y: yTemp,
            colorString: app.image.hslaToString(app.ui.pallet.color)
         })

         yTemp += yDir
      }
      console.log(temporaryPixels)


      return temporaryPixels
   }
}
