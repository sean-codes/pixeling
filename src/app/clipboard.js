app.clipboard = {
   store: {},
   selection: {},
   copy: function(area) {
      this.store = app.clone(app.component.cursor.selected.copy)
   },

   cut: function(area) {
      this.store = this.getCopy(area)
      app.image.clearPixels(area)
   },

   paste: function(x=0, y=0) {
      //this.pasteCopy(x, y, this.store)

      if(app.component.cursor.selected) {
         this.pasteCopy(
            app.component.cursor.selected.x,
            app.component.cursor.selected.y,
            app.component.cursor.selected.copy)
      }
      var copy = this.store

      var selected = {
         ...copy.dimensions,
         copy
      }

      app.component.cursor.update({ selected })
   },

   pasteCopy(x, y, copy) {

      console.log('paste: attempting', x, y, copy)
      if(!copy) {
         return console.log('paste: nothing has been copied')
      }

      for(var cx = 0; cx < copy.dimensions.width; cx++) {
         for(var cy = 0; cy < copy.dimensions.height; cy++) {
            var pasteX = cx + x
            var pasteY = cy + y
            copy.pixels[cx][cy].x = pasteX
            copy.pixels[cx][cy].y = pasteY
            if(app.image.pixels[pasteX] && app.image.pixels[pasteX][pasteY]) {
               app.image.pixels[pasteX][pasteY] = app.clone(copy.pixels[cx][cy])
            }
         }
      }
      app.image.loopPixels(copy.dimensions, copy.pixels, (pixel) => {

         app.image.pixels[pixel.x][pixel.y] = pixel
      })

      app.component.canvas.updateImage(app.image)
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

      for(var x = 0; x < area.width; x++) {
         copy.pixels[x] = []
         for(var y = 0; y < area.height; y++) {
            copy.pixels[x][y] = app.image.pixels[area.x+x][area.y+y]
         }
      }

      return app.clone(copy)
   }
}
