class ToolSelect {
   constructor() {
      this.size = 1
      this.color = '#FFF'


   }

   select() {
      app.global.color = 'rgba(0, 0, 0, 0)'
      app.script.setCursor({ selected: undefined, fill: false })
   }


   move(mouse) {
      app.script.setCursor({
         x: mouse.positionCurrent.x,
         y: mouse.positionCurrent.y
      })
   }

   down(mouse) {
      app.script.setCursor({
         selected: {
            x: mouse.positionStart.x,
            y: mouse.positionStart.y,
            width: 1,
            height: 1
         }
      })
   }

   stroke(mouse) {
      app.script.setCursor({
         selected: this.getSelected(mouse)
      })
   }

   up(mouse) {
      if(this.mouseDidNotMove(mouse)) {
         return app.script.setCursor({ selected: undefined })
      }

      app.script.setCursor({
         selected: this.getSelected(mouse)
      })
   }

   getSelected(mouse) {
      var moved = this.getMouseMoved(mouse)
      var x = mouse.positionStart.x
      var y = mouse.positionStart.y
      var width = Math.abs(moved.width) + 1
      var height = Math.abs(moved.height) + 1

      if(moved.width < 0) x += moved.width
      if(moved.height < 0) y += moved.height

      return { x, y, width, height }
   }

   mouseDidNotMove(mouse) {
      var moved = this.getMouseMoved(mouse)
      return (!moved.width && !moved.height)
   }

   getMouseMoved(mouse) {
      return {
         width: mouse.positionCurrent.x - mouse.positionStart.x,
         height: mouse.positionCurrent.y - mouse.positionStart.y
      }
   }

}
