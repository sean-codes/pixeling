app.tools.draw = {

   select() {
      app.component.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      this.draw(mouse.positionCurrent)
   },

   move(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.component.cursor.update(mouse.positionCurrent)
      this.draw(mouse.positionCurrent)
   },

   draw(position) {
      app.image.drawPixels({
         x: position.x,
         y: position.y,
         width: app.component.cursor.size,
         height: app.component.cursor.size
      })
   }
}
