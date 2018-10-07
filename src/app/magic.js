app.magic = {
   pixelsBetweenPoints(p1, p2, size = 1) {
      var xStart = p1.x
      var yStart = p1.y
      var xEnd = p2.x
      var yEnd = p2.y

      // hmm hypotnuse is multiply them with some squigly over
      var xLength = xEnd-xStart || 0.0001
      var yLength = yEnd-yStart || 0.0001
      var lineLength = Math.sqrt(xLength*xLength + yLength*yLength)

      // unit that vector ya
      var xUnit = 0.5 / (lineLength / xLength)
      var yUnit = 0.5 / (lineLength / yLength)

      // ok give me an array of pixels on the double
      var pixels = []

      var lastX, lastY

      while(
         (yUnit > 0 ? yStart <= yEnd : yEnd <= yStart) ||
         (xUnit > 0 ? xStart <= xEnd : xStart > xEnd )
      ) {
         var xPos = Math.round(xStart)
         var yPos = Math.round(yStart)

         if(lastX != xPos || lastY != yPos) {
            var pos = { x: xPos, y: yPos }

            lastX = xPos
            lastY = yPos
         }

         pixels = pixels.concat(this.pixelsAroundForSize(pos, size))

         xStart += xUnit
         yStart += yUnit
      }

      // sean reduce here. its okay we can figure the more performat later!
      return this.removeCollidingPixels(pixels)
   },

   pixelsAroundForSize(point, size) {
      var xStart = point.x - Math.floor(size/2)
      var yStart = point.y - Math.floor(size/2)

      var temporaryPixels = []
      for(var x = xStart; x < xStart + size; x++) {
         for(var y = yStart; y < yStart + size; y++) {
            temporaryPixels.push({
               x,
               y,
               color: app.ui.pallet.color,
               colorString: app.frames.hslaToString(app.ui.pallet.color)
            })
         }
      }

      return temporaryPixels
   },

   removeCollidingPixels(pixels) {
      return pixels.reduce((sum, num) => {
         var collision = sum.some((p) => { return p.x == num.x && p.y == num.y})
         if(!collision) sum.push(num)
         return sum
      }, [])
   },
}
