app.clipboard = {
   store: {},
   copy: function(area) {
      var copy = {
         dimensions: {
            x: 0,
            y: 0,
            width: area.width,
            height: area.height
         },
         pixels: {}
      }

      app.utility.loopPixels(area, app.image.pixels, (pixelID, pixel) => {
         pixel.position.x -= area.x
         pixel.position.y -= area.y
         var newID = app.utility.pixelID(pixel.position.x, pixel.position.y)
         copy.pixels[newID] = pixel
      })

      this.store = copy
   },
   paste: function() {
      var copy = this.store

      console.log('paste: attempting')
      if(!copy) {
         return console.log('paste: nothing has been copied')
      }

      console.log('paste: pasting', copy)
      app.utility.loopPixels(copy.dimensions, copy.pixels, (pixelID, pixel) => {
         app.image.pixels[pixelID] = pixel
      })

      app.component.cursor.update({
         selected: copy.dimensions
      })
      
      app.component.canvas.updateImage(app.image)
   }
}
