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
      if(app.ui.cursor.selected) {
         app.clipboard.pasteCopy(app.ui.cursor.selected)
         app.history.rewrite()
         app.updateFrames()
      }

      app.ui.cursor.update({ selected: undefined })
   },

   selectAll() {
      var imageRect = app.frames.getImageRect()
      app.ui.cursor.update({
         selected: {
            x: imageRect.x,
            y: imageRect.y,
            width: imageRect.width,
            height: imageRect.height,
            copy: app.clipboard.getCopy(imageRect)
         }
      })

      app.frames.setTemporary()
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
         var frame = app.frames.getCurrentFrame()
         frame.ctx.clearRect(selected.x, selected.y, selected.width, selected.height)

         app.updateFrames()
      }
   },
})
