app.clipboard = {
   store: {},
   selection: {},

   copy: function() {
      var selected = app.ui.cursor.selected

      var store = {
         dimensions: selected,
         imageData: selected.copy.toDataURL()
      }

      localStorage.setItem('copy', JSON.stringify(store))
   },

   cut: function(area) {
      this.store = this.getCopy(area)
      app.image.clearPixels(area)
   },

   paste: function(x=0, y=0) {
      var copy = JSON.parse(localStorage.getItem('copy'))
      if(!this.isASafeCopy(copy)) {
         console.log('is not safe to paste')
         return
      }

      if (app.ui.cursor.selected) {
         this.pasteCopy(app.ui.cursor.selected)
      }

      // load in the copy form localstorage
      var copyImg = document.createElement('img')
      copyImg.src = copy.imageData
      copyImg.onload = () => {
         var selected = {
            x: 0, y: 0,
            width: copy.dimensions.width,
            height: copy.dimensions.height,
            copy: copyImg
         }
         document.body.appendChild(copyImg)
         app.ui.cursor.update({ selected })
         app.updateFrames()
      }
   },

   getCopy: function(selected) {
      var frame = app.frames.getCurrentFrame()

      var copyCanvas = document.createElement('canvas')
      copyCanvas.width = selected.width
      copyCanvas.height = selected.height
      copyCanvas.getContext('2d').drawImage(frame.canvas,
         selected.x, selected.y, selected.width, selected.height,
         0, 0, selected.width, selected.height
      )

      return copyCanvas
   },

   pasteCopy: function(selected) {
      var frame = app.frames.getCurrentFrame()
      frame.ctx.drawImage(selected.copy, selected.x, selected.y)
   },

   isASafeCopy: function(copy) {
      if (
         copy.dimensions.x != null &&
         copy.dimensions.y != null &&
         copy.dimensions.width &&
         copy.dimensions.height &&
         copy.imageData
      ) return true
   }
}
