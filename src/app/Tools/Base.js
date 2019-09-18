// some functions all tools can use
app.tools.Base = function(overrides) {
   this.utility = {
      // pixelsBetweenPoints: ,

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

      mouseDidMove(mouse) {
         return (mouse.positionDelta.x || mouse.positionDelta.y)
      },

      mouseHasMoved(mouse) {
         return (mouse.positionTotalDelta.x || mouse.positionTotalDelta.y)
      },

      mouseMovedRect(mouse) {
         var x = mouse.positionStart.x
         var y = mouse.positionStart.y
         var width = Math.abs(mouse.positionTotalDelta.x) + 1
         var height = Math.abs(mouse.positionTotalDelta.y) + 1
         if(mouse.positionTotalDelta.x < 0) x += mouse.positionTotalDelta.x
         if(mouse.positionTotalDelta.y < 0) y += mouse.positionTotalDelta.y

         return { x, y, width, height }
      }
   }

   // add functions
   for(var override in overrides) {
      this[override] = overrides[override]
   }
}
