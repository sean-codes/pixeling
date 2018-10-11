app.tools.read = new app.tools.Base({
   hint: 'shortcut: r',
   select() {
      app.ui.cursor.update({ selected: false, mode: 'read' })
   },

   down(mouse) {
      var image = app.frames.getCurrentFrame()
      var x = mouse.positionCurrent.x
      var y = mouse.positionCurrent.y

      var pixel = image.pixels[x][y]
      var color = pixel.color

      if(color.h || color.s || color.l || color.a) {
         app.ui.pallet.setColor(color)
      }
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   choose(position) {
      console.log('read pixel')

   }
})
