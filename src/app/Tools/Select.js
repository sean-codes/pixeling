app.tools.select = new app.tools.Base({
   select() {
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

      this.unsetSelected()
   },

   stroke(mouse) {
      mouse.dragging
         ? this.moveCursorSelected(mouse)
         : this.setSelectedAndCopy(mouse)
   },

   up(mouse) {
      if(mouse.dragging) {
         return
      }

      this.setSelectedAndCopy(mouse, true)
   },

   moveCursorSelected(mouse) {
      app.ui.cursor.selected.x += mouse.positionDelta.x
      app.ui.cursor.selected.y += mouse.positionDelta.y
      app.ui.cursor.update()
      app.updateFrame()
   },

   unsetSelected() {
      if(app.ui.cursor.selected) {

         app.clipboard.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)

         // if(app.ui.cursor.selected.sx == app.ui.cursor.selected.x
         // && app.ui.cursor.selected.sy== app.ui.cursor.selected.y ) {
         //    app.history.undo()
         // } else {
         app.ui.cursor.update({ selected: undefined })
         app.history.rewrite()
         // }
      }

      app.ui.cursor.update({ selected: undefined })
   },

   setSelectedAndCopy(mouse, shouldCopy=false) {
      var copyRect = this.utility.mouseMovedRect(mouse)
      copyRect.sx = app.ui.cursor.selected ? app.ui.cursor.selected.sx : copyRect.x
      copyRect.sy = app.ui.cursor.selected ? app.ui.cursor.selected.sy : copyRect.y

      var copyRectLargerThanAPixel = copyRect.width > 1 || copyRect.height > 1
      var copy = undefined

      if(copyRectLargerThanAPixel) {
         if(shouldCopy) {
            app.history.push()
            copy = app.clipboard.getCopy(copyRect)
            app.frames.clearPixels(copyRect)
         }

         var selected = { ...copyRect, copy }
         app.ui.cursor.update({ selected })
         app.updateFrame()
      }
   },

})
