app.tools.fill = new app.tools.Base({
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
      var initialColor = app.frames.readPixel(pos.x, pos.y)

      var initialColorRgba = app.util.hslaToRgba(initialColor.h, initialColor.s, initialColor.l, initialColor.a)

      this.fillAdjecentPixels(pos, initialColorRgba)

      app.updateFrames()
      app.history.push()
   },

   fillAdjecentPixels(pos, color) {
      var checked = {}
      var unconfirmed = [ pos ]

      var frame = app.frames.getCurrentFrame()
      var frameImageData = frame.ctx.getImageData(0, 0, app.frames.width, app.frames.height)

      while (unconfirmed.length) {
         var pos = unconfirmed.shift()

         if(pos.x < 0 || pos.x >= app.frames.width) continue
         if(pos.y < 0 || pos.y >= app.frames.height) continue
         if(checked[pos.x + '-' + pos.y]) continue

         checked[pos.x + '-' + pos.y] = true

         var i = (pos.y * (app.frames.width * 4)) + (pos.x * 4)
         var [r, g, b, a] = frameImageData.data.slice(i, i + 4)

         if (r == color.r && g == color.g && b == color.b && a == color.a) {
            frame.ctx.fillStyle = app.colorString
            frame.ctx.fillRect(pos.x, pos.y, 1, 1)
            unconfirmed.push({ x: pos.x, y: pos.y - 1 })
            unconfirmed.push({ x: pos.x, y: pos.y + 1 })
            unconfirmed.push({ x: pos.x - 1, y: pos.y })
            unconfirmed.push({ x: pos.x + 1, y: pos.y })
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
})
