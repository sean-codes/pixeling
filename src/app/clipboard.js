app.clipboard = {
   store: {},
   selection: {},
   copy: function(area) {
      var store = {
         dimensions: app.ui.cursor.selected.copy.dimensions,
         imageData: app.ui.cursor.selected.copy.canvas.toDataURL()
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
         console.log('is not safe to paste');
         return
      }

      // drop what is within cursor
      if(app.ui.cursor.selected) {
         this.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)
      }

      // load in the copy form localstorage
      var copyImg = document.createElement('img')
      copyImg.src = copy.imageData
      copyImg.onload = () => {
         // paste the item
         var copyCanvas = document.createElement('canvas')
         copyCanvas.width = copy.dimensions.width
         copyCanvas.height = copy.dimensions.height
         var copyCtx = copyCanvas.getContext('2d')
         copyCtx.drawImage(copyImg, 0, 0)

         var selected = {
            x: 0, y: 0,
            width: copy.dimensions.width,
            height: copy.dimensions.height,
            copy: {
               dimensions: {
                  x: 0, y: 0,
                  width: copy.dimensions.width,
                  height: copy.dimensions.height,
               },
               canvas: copyCanvas,
               ctx: copyCtx
            }
         }

         app.ui.cursor.update({ selected })
         app.updateFrames()
      }
   },

   pasteCopy: function(x, y, copy) {
      var frame = app.frames.getCurrentFrame()
      frame.ctx.drawImage(copy.canvas, x, y)

      app.updateFrames()
   },

   getCopy: function(area) {
      var copyCanvas = document.createElement('canvas')
      copyCanvas.width = area.width
      copyCanvas.height = area.height

      var copy = {
         dimensions: {
            x: 0,
            y: 0,
            width: area.width,
            height: area.height
         },
         canvas: copyCanvas,
         ctx: copyCanvas.getContext('2d')
      }
      copy.ctx.imageSmoothingEnabled = false
      var frame = app.frames.getCurrentFrame()
      copy.ctx.drawImage(frame.canvas, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height)
      return copy
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
