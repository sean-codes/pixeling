app.tools.select = {
   copy: {},

   select() {
      app.global.color = 'rgba(0, 0, 0, 0)'
      app.script.setCursor({
         selected: undefined,
         fill: false,
         mode: 'select'
      })
   },

   unSelect() {
      if(app.component.cursor.selected) {
         app.clipboard.pasteCopy(
            app.component.cursor.selected.x,
            app.component.cursor.selected.y,
            app.component.cursor.selected.copy)
      }
   },

   move(mouse) {
      app.script.setCursor({
         x: mouse.positionCurrent.x,
         y: mouse.positionCurrent.y
      })
   },

   down(mouse) {
      app.script.setCursor({
         mode: 'none'
      })
      if(mouse.dragging) {
         return
      }

      if(app.component.cursor.selected) {
         app.clipboard.pasteCopy(
            app.component.cursor.selected.x,
            app.component.cursor.selected.y,
            app.component.cursor.selected.copy)
      }

      app.script.setCursor({
         selected: {
            x: mouse.positionStart.x,
            y: mouse.positionStart.y,
            width: 1,
            height: 1,
            copy: undefined
         }
      })
   },

   stroke(mouse) {
      if(mouse.dragging) {
         console.log('select tool: dragging')

         app.component.cursor.selected.x += mouse.positionDelta.x
         app.component.cursor.selected.y += mouse.positionDelta.y

         app.component.cursor.update()
         return
      }

      app.script.setCursor({
         selected: this.getSelected(mouse)
      })
   },

   up(mouse) {
      app.script.setCursor({
         mode: 'select',
         ...mouse.positionEnd
      })

      if(mouse.dragging) {
         return
      }

      if(this.mouseDidNotMove(mouse)) {
         return app.script.setCursor({ selected: undefined })
      }

      // save current image state
      app.history.push()

      var selected = this.getSelected(mouse)
      app.script.setCursor({ selected })
      app.utility.clearPixels(selected)
   },

   getSelected(mouse) {
      var moved = this.getMouseMoved(mouse)
      var x = mouse.positionStart.x
      var y = mouse.positionStart.y
      var width = Math.abs(moved.width) + 1
      var height = Math.abs(moved.height) + 1
      if(moved.width < 0) x += moved.width
      if(moved.height < 0) y += moved.height

      var copy = app.clipboard.getCopy({ x, y, width, height })

      return { x, y, width, height, copy }
   },

   mouseDidNotMove(mouse) {
      var moved = this.getMouseMoved(mouse)
      return (!moved.width && !moved.height)
   },

   getMouseMoved(mouse) {
      return {
         width: mouse.positionCurrent.x - mouse.positionStart.x,
         height: mouse.positionCurrent.y - mouse.positionStart.y
      }
   }
}
