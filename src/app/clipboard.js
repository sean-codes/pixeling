app.clipboard = {
   store: {},
   selection: {},
   copy: function(area) {
      var store = JSON.stringify(app.ui.cursor.selected.copy)
      localStorage.setItem('copy', store)
   },

   cut: function(area) {
      this.store = this.getCopy(area)
      app.image.clearPixels(area)
   },

   paste: function(x=0, y=0) {
      // drop what is within cursor
      if(app.ui.cursor.selected) {
         this.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)
      }

      var copy = JSON.parse(localStorage.getItem('copy'))
      if(!this.isASafeCopy(copy)) {
         console.log('is not safe to paste');
         return
      }

      // put the copy into the cursor
      var selected = { ...copy.dimensions, copy }
      app.ui.cursor.update({ selected })
      app.updateFrame()
   },

   pasteCopy: function(x, y, copy) {
      //if(!copy || !copy.dimensions) return

      var image = app.frames.getCurrentFrame()
      for(var cx = 0; cx < copy.dimensions.width; cx++) {
         for(var cy = 0; cy < copy.dimensions.height; cy++) {
            var pasteX = cx + x
            var pasteY = cy + y
            copy.pixels[cx][cy].x = pasteX
            copy.pixels[cx][cy].y = pasteY
            if(image.pixels[pasteX] && image.pixels[pasteX][pasteY]) {
               var copyPixel = copy.pixels[cx][cy]
               app.frames.drawPixel(pasteX, pasteY, copyPixel.color)
            }
         }
      }

      app.updateFrame()
   },

   getCopy(area) {
      var copy = {
         dimensions: {
            x: 0,
            y: 0,
            width: area.width,
            height: area.height
         },
         pixels: []
      }

      var image = app.frames.getCurrentFrame()
      for(var x = 0; x < area.width; x++) {
         copy.pixels[x] = []
         for(var y = 0; y < area.height; y++) {
            copy.pixels[x][y] = image.pixels[area.x+x][area.y+y]
         }
      }

      return app.clone(copy)
   },

   isASafeCopy(copy) {
      console.log(copy)
      if (
         copy.dimensions.x != null &&
         copy.dimensions.y != null &&
         copy.dimensions.width &&
         copy.dimensions.height &&
         copy.pixels.length
      ) return true
   }
}
