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
         : this.setSelected(mouse)
   },

   up(mouse) {
      if(!mouse.dragging) {
         this.setCopy()
      }
   },

   moveCursorSelected(mouse) {
      app.ui.cursor.selected.x += mouse.positionDelta.x
      app.ui.cursor.selected.y += mouse.positionDelta.y
      app.ui.cursor.update()

      app.updateFrames()
   },

   unsetSelected() {
      if(app.ui.cursor.selected && app.ui.cursor.selected.copy) {
         app.clipboard.pasteCopy(app.ui.cursor.selected)
         app.history.rewrite()
         app.updateFrames()
      }

      app.ui.cursor.update({ selected: undefined })
   },

   selectAll() {
      var rect = {
         x: 0,
         y: 0,
         width: app.frames.width,
         height: app.frames.height
      }
      app.ui.cursor.update({
         selected: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            copy: app.clipboard.getCopy(rect)
         }
      })

      app.frames.clear({
         x: 0, y: 0,
         width: app.frames.width,
         height: app.frames.height
      })
      app.updateFrames()
   },

   setSelected(mouse) {
      var copyRect = this.utility.mouseMovedRect(mouse)
      copyRect.sx = app.ui.cursor.selected ? app.ui.cursor.selected.sx : copyRect.x
      copyRect.sy = app.ui.cursor.selected ? app.ui.cursor.selected.sy : copyRect.y

      var copyRectLargerThanAPixel = copyRect.width > 1 || copyRect.height > 1

      var selected = !copyRectLargerThanAPixel ? undefined : {
         x: copyRect.x,
         y: copyRect.y,
         width: copyRect.width,
         height: copyRect.height,
         copy: undefined
      }

      app.ui.cursor.update({ selected })
   },

   setCopy(mouse) {
      var selected = app.ui.cursor.selected
      if (selected) {
         app.history.push()
         selected.copy = app.clipboard.getCopy(selected)

         // pull that copy off
         app.frames.clear(selected)
         app.updateFrames()
      }
   },
})
