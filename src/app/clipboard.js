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

      console.log('paste: attempting', x, y)
      if(!copy) {
         return console.log('paste: nothing has been copied')
      }

      console.log('paste: pasting', copy)
      app.image.loopPixels(copy.dimensions, copy.pixels, (pixelID, pixel) => {
         var newPixelID = app.image.pixelID(pixel.position.x + x, pixel.position.y + y)
         pixel.position.x += x
         pixel.position.y += y
         app.image.pixels[newPixelID] = pixel
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
         pixels: {}
      }

      app.image.loopPixels(area, app.image.pixels, (pixelID, pixel) => {
         pixel.position.x -= area.x
         pixel.position.y -= area.y
         var newID = app.image.pixelID(pixel.position.x, pixel.position.y)
         copy.pixels[newID] = pixel
      })

      return app.clone(copy)
   }
}
