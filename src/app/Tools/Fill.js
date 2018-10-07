app.tools.fill = {
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'fill' })
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   down(mouse) {
      var frame = app.frames.getCurrentFrame()
      var pos = mouse.positionCurrent
      var pixel = frame.pixels[pos.x][pos.y]
      var initialColor = app.clone(pixel.color)
      app.frames.drawPixel(pos.x, pos.y, app.ui.pallet.color)

      // if the color delta is not really changed
      if(this.colorsCloseEnough(initialColor, pixel.color)){
         return
      }
      this.fillAdjecentPixels(pos, initialColor)
      app.ui.canvas.updateImage(frame)
      app.history.push()
   },

   fillAdjecentPixels(pos, color) {
      // sort of dangerous
      // thinking we search top right bottom left and curse
      // might run into a infinite
      // possibly we check if the pixel hasnt been painted. dont curse that
      var positions = {
         top: { x: pos.x, y: pos.y - 1 },
         bottom: { x: pos.x, y: pos.y + 1 },
         left: { x: pos.x - 1, y: pos.y },
         right: { x: pos.x + 1, y: pos.y }
      }

      var image = app.frames.getCurrentFrame()
      for(var positionName in positions) {
         var position = positions[positionName]
         if(position.x < 0 || position.x == image.width) continue
         if(position.y < 0 || position.y == image.height) continue
         var pixelAtAdj = image.pixels[position.x][position.y]
         if(this.colorsCloseEnough(color, pixelAtAdj.color)) {
            app.frames.drawPixel(position.x, position.y, app.ui.pallet.color)
            this.fillAdjecentPixels(position, color)
         }
      }
   },

   colorsCloseEnough(c1, c2) {
      return (
         Math.abs(c1.h - c2.h) <= 1 &&
         Math.abs(c1.s - c2.s) <= 1 &&
         Math.abs(c1.l - c2.l) <= 1 &&
         Math.abs(c1.a - c2.a) <= 0.1
      )
   }
}
