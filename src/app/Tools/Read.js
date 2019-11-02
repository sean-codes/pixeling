app.tools.read = new app.tools.Base({
   hint: 'shortcut: r',
   select() {
      app.ui.cursor.update({ selected: false, mode: 'read' })
   },

   down(mouse) {
      var frame = app.frames.getCurrentFrame()
      var x = mouse.positionCurrent.x
      var y = mouse.positionCurrent.y

      var color = app.frames.readPixel(x, y)
      // transparent lets leave!
      if (!color.a) return
      
      app.ui.pallet.setColor(color, true)
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },
})
