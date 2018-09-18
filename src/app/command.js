app.command = {
   copy: function() {
      var selected = app.component.cursor.selected
      if(selected) {
         var copy = app.utility.copyArea(selected)
         console.log('copy: adding to clipboard', copy)
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

      app.component.cursor.update({
         selected: lastCopied.dimensions
      })
      app.component.canvas.updateImage(app.image)
   }
}
