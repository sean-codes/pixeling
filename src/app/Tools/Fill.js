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
      var checked = new Array(app.frames.width * app.frames.height)
      var unconfirmed = new Array(app.frames.width * app.frames.height * 4 + 1 * 2)
      var pointer = 0
      unconfirmed[pointer] = pos.x
      unconfirmed[pointer + 1] = pos.y
      pointer += 2
      check = 0

      var frame = app.frames.getCurrentFrame()
      var frameImageData = frame.ctx.getImageData(0, 0, app.frames.width, app.frames.height)

      while (check < pointer && pointer < 2000 * 2000 * 2) {
         var x = unconfirmed[check]
         var y = unconfirmed[check + 1]
         check += 2

         if(x < 0 || x >= app.frames.width) continue
         if(y < 0 || y >= app.frames.height) continue

         var id = y * app.frames.width + x
         if(checked[id]) continue
         checked[id] = true

         var dataId = id * 4

         if (
            Math.abs(frameImageData.data[dataId + 0] - color.r) < 3
            && Math.abs(frameImageData.data[dataId + 1] - color.g) < 3
            && Math.abs(frameImageData.data[dataId + 2] - color.b) < 3
            && Math.abs(frameImageData.data[dataId + 3] - color.a) < 3
         ) {
            frameImageData.data[dataId] = app.rgba.r
            frameImageData.data[dataId + 1] = app.rgba.g
            frameImageData.data[dataId + 2] = app.rgba.b
            frameImageData.data[dataId + 3] = app.rgba.a

            unconfirmed[pointer] = x
            unconfirmed[pointer + 1] = y - 1
            unconfirmed[pointer + 2] = x
            unconfirmed[pointer + 3] = y + 1
            unconfirmed[pointer + 4] = x - 1
            unconfirmed[pointer + 5] = y
            unconfirmed[pointer + 6] = x + 1
            unconfirmed[pointer + 7] = y
            pointer += 8
         }
      }

      frame.ctx.putImageData(frameImageData, 0, 0)
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
