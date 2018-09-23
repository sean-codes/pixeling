app.tools.select = {
   select() {
      app.global.color = 'rgba(0, 0, 0, 0)'
      app.component.cursor.update({ mode: 'select' })
   },

   unSelect() {
      this.unsetSelected()
   },

   move(mouse) {
      app.component.cursor.update({ ...mouse.positionCurrent })
   },

   down(mouse) {
      if(mouse.dragging) {
         return
      }

      if(app.component.cursor.selected) {
         app.clipboard.pasteCopy(
            app.component.cursor.selected.x,
            app.component.cursor.selected.y,
            app.component.cursor.selected.copy)
      }

      app.component.cursor.update({
         selected: {
            ...mouse.positionStart,
            copy: undefined
         }
      })
   },

   stroke(mouse) {
      if(mouse.dragging) {
         app.component.cursor.selected.x += mouse.positionDelta.x
         app.component.cursor.selected.y += mouse.positionDelta.y

         app.component.cursor.update()
         return
      }

      app.component.cursor.update({ selected: this.getSelected(mouse) })
   },

   up(mouse) {
      app.component.cursor.update({...mouse.positionEnd, mode: 'select' })

      if(mouse.dragging) {
         return
      }

      if(this.mouseDidNotMove(mouse)) {
         this.unsetSelected()
         return
      }

      this.setSelected(mouse)
   },

   setSelected(mouse) {
      app.history.push()

      var selected = this.getSelected(mouse)
      app.component.cursor.update({ selected })
      app.image.clearPixels(selected)
   },

   unsetSelected() {
      if(app.component.cursor.selected) {
         app.clipboard.pasteCopy(
            app.component.cursor.selected.x,
            app.component.cursor.selected.y,
            app.component.cursor.selected.copy
         )
      }

      app.component.cursor.update({ selected: undefined })
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
