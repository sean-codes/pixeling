app.util = {
   hslaToRgba(h, s, l, a) {
      app.scratchCtx.clearRect(0, 0, 1, 1)
      app.scratchCtx.fillStyle = this.hslaToString({ h, s, l, a})
      app.scratchCtx.fillRect(0, 0, 1, 1)

      var [r, g, b, a] = app.scratchCtx.getImageData(0, 0, 1, 1).data
      return {r, g, b, a}
   },

   rgbaToHsla(r, g, b, a) {
      // help me <3
      r /= 255, g /= 255, b /= 255, a /= 255

      var min = Math.min(r, g, b), max = Math.max(r, g, b)
      var h=0, s=0, l = (min+max) / 2, d = max-min

      if(!d) return { h, s, l: l*100, a }

      s = l < 0.5 ? d / (max+min) : d / (2-max-min)
      var dR = (((max-r) / 6) + (d/2)) / d
      var dG = (((max-g) / 6) + (d/2)) / d
      var dB = (((max-b) / 6) + (d/2)) / d

      h = r==max ? dB-dG : g==max ? (1/3)+dR-dB : (2/3)+dG-dR
      h = h<0 ? h+1 : h>1 ? h-1 : h
      return {
         h: Math.round(h*360*10)/10,
         s: Math.round(s*100),
         l: Math.round(l*100),
         a: Math.round(a*100)/100
      }
   },

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   },

   transparentColor() {
      return { h: 0, s: 0, l: 0, a: 0 }
   },

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

         pixels.push(pos) // pixels.concat(this.pixelsAroundForSize(pos, size))

         xStart += xUnit
         yStart += yUnit
      }

      // sean reduce here. its okay we can figure the more performat later!
      return pixels
      // return this.removeCollidingPixels(pixels)
   }
}
