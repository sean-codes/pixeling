app.tools.select = {
   hint: 'shortcut: s',
   select() {
      app.global.color = 'rgba(0, 0, 0, 0)'
      app.ui.cursor.update({ mode: 'select' })
   },

   unSelect() {
      this.unsetSelected()
   },

   move(mouse) {
      app.ui.cursor.update({ ...mouse.positionCurrent })
   },

   down(mouse) {
      if(mouse.dragging) {
         return
      }

      if(app.ui.cursor.selected) {
         app.clipboard.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)
      }

      app.ui.cursor.update({
         selected: {
            ...mouse.positionStart,
            copy: undefined
         }
      })
   },

   stroke(mouse) {
      if(mouse.dragging) {
         app.ui.cursor.selected.x += mouse.positionDelta.x
         app.ui.cursor.selected.y += mouse.positionDelta.y

         app.ui.cursor.update()
         return
      }

      app.ui.cursor.update({ selected: this.getSelected(mouse) })
   },

   up(mouse) {
      app.ui.cursor.update({...mouse.positionEnd, mode: 'select' })

      if(mouse.dragging) {
         return
      }

      if(this.mouseDidNotMove(mouse)) {
         this.unsetSelected()
         app.history.push()
         return
      }

      this.setSelected(mouse)
      app.updateFrame()
   },

   setSelected(mouse) {
      var selected = this.getSelected(mouse)
      app.ui.cursor.update({ selected })
      app.frames.clearPixels(selected)
   },

   unsetSelected() {
      if(app.ui.cursor.selected) {
         app.clipboard.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy
         )
      }

      app.ui.cursor.update({ selected: undefined })
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
