app.tools.read = {

   select() {
      app.component.cursor.update({ selected: false, mode: 'read' })
   },

   down(mouse) {
      var x = mouse.positionCurrent.x
      var y = mouse.positionCurrent.y

      var pixel = app.image.pixels[x][y]
      var color = pixel.color

      if(color.h || color.s || color.l || color.a) {
         app.component.pallet.setColor(color)
      }
   },

   move(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
   },

   choose(position) {
      console.log('read pixel')

   }
}
