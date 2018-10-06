app.tools.draw = {
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      this.draw(mouse.positionCurrent)
   },

   up(mouse) {
      app.history.push()
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)

      this.draw(mouse.positionCurrent)
   },

   draw(position) {
      app.image.drawPixels({
         x: Math.ceil(position.x - app.ui.cursor.size/2),
         y: Math.ceil(position.y - app.ui.cursor.size/2),
         width: app.ui.cursor.size,
         height: app.ui.cursor.size
      })
   }
}
