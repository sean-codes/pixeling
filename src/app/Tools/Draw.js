app.tools.draw = {
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      app.history.push()
      this.draw(mouse.positionCurrent)
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
         x: position.x,
         y: position.y,
         width: app.ui.cursor.size,
         height: app.ui.cursor.size
      })
   }
}
