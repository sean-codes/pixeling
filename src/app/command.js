app.command = {
   copy: function() {
      var selected = app.component.cursor.selected
      if(selected) {
         console.log('copy: selecting', selected)
         var copy = {
            dimensions: {
               width: selected.width,
               height: selected.height
            },
            pixels: {}
         }

         app.utility.loopPixels(selected, app.image.pixels, (pixelID, pixel) => {
            pixel.position.x -= selected.x
            pixel.position.y -= selected.y
            var newID = app.utility.pixelID(pixel.position.x, pixel.position.y)
            copy.pixels[newID] = pixel

         })

         console.log('copy: add to clipboard', copy)
         app.global.clipboard.push(copy)
      }
   },
   paste: function() {
      var clipboard = app.global.clipboard

      console.log('paste: attempting')
      if(!clipboard.length) {
         return console.log('paste: nothing has been copied')
      }

      var lastCopied = clipboard[clipboard.length - 1]
      console.log('paste: pasting', lastCopied)
      app.utility.loopPixels(lastCopied.dimensions, lastCopied.pixels, (pixelID, pixel) => {
         app.image.pixels[pixelID] = pixel
      })

      app.component.canvas.updateImage(app.image)
   }
}
