app.tools.select = new app.tools.Base({
   hasPushedHistory: false,

   select() {
      app.ui.cursor.update({ mode: 'select' })
   },

   unSelect() {
      this.unsetSelected()
   },

   move(mouse) {
      var updatedPosition = Object.assign({}, mouse.positionCurrent)
      app.ui.cursor.update(updatedPosition)
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
         this.hasPushedHistory = false
         return
      }

      this.setSelectedAndCopy(mouse, true)
   },

   moveCursorSelected(mouse) {
      if (!this.hasPushedHistory) {
         this.hasPushedHistory = true
         app.history.push()
      }

      app.ui.cursor.selected.x += mouse.positionDelta.x
      app.ui.cursor.selected.y += mouse.positionDelta.y
      app.ui.cursor.update()
      app.updateFrames()
   },

   unsetSelected() {
      if(app.ui.cursor.selected) {

         app.clipboard.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)

         app.ui.cursor.update({ selected: undefined })
         app.history.rewrite()
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
            copy = app.clipboard.getCopy(copyRect)
            app.frames.clearPixels(copyRect)
         }

         var selected = { copy }
         selected = Object.assign(selected, copyRect)
         
         app.ui.cursor.update({ selected })
         app.updateFrames()
      }
   },

})
