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
         // put down what is currently held
         this.pasteCopy(app.ui.cursor.selected)
      }

      // load in the copy form localstorage
      var copyImg = document.createElement('img')
      var copyCanvas = document.createElement('canvas')
      copyImg.src = copy.imageData
      copyImg.onload = () => {
         copyCanvas.width = copyImg.width
         copyCanvas.height = copyImg.height
         copyCanvas.getContext('2d').drawImage(copyImg, 0, 0)
         var selected = {
            x: copy.dimensions.x >= app.frames.width ? 0 : copy.dimensions.x,
            y: copy.dimensions.y >= app.frames.height ? 0 : copy.dimensions.y,
            width: copy.dimensions.width,
            height: copy.dimensions.height,
            copy: copyCanvas
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

      // constrain
      var cXStart = Math.max(selected.x, 0)
      var cYStart = Math.max(selected.y, 0)
      var offsetX = cXStart - selected.x
      var offsetY = cYStart - selected.y
      var cXEnd = Math.min(app.frames.width, (selected.x + selected.width))
      var cYEnd = Math.min(app.frames.height, (selected.y + selected.height))

      var width = cXEnd - cXStart
      var height = cYEnd - cYStart

      copyCanvas.getContext('2d').drawImage(frame.canvas,
         cXStart, cYStart, width, height, //source
         offsetX, offsetY, width, height, //dest
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
