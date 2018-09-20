app.script = {
   parseKeyEvent: function(e) {
      e.preventDefault()

      var modifiers = []
      if(e.altKey) modifiers.push('alt')
      if(e.ctrlKey) modifiers.push('ctrl')
      if(e.metaKey) modifiers.push('meta')
      if(e.shiftKey) modifiers.push('shift')

      app.script.keydown(modifiers, e.key)
   },

   keydown: function(modifiers, key) {
      for(var keybind of app.keybinds) {
         // figure if the match
         var keybindString = JSON.stringify(keybind.modifiers.sort())
         var keydownString = JSON.stringify(modifiers.sort())
         var match = keybindString == keydownString && key == keybind.key // lol weak :]

         if(match) {
            app.command[keybind.command]()
         }
      }
   },

   setColor: function(color) {

      
   },

   usePalletColor: function() {
      app.global.color = app.component.pallet.color
   },

   erasePixelAtPosition: function(position) {
      var pixelID = position.x + 'x' + position.y
      delete app.image.pixels[pixelID]

      app.component.canvas.updateImage(app.image)
   },

   updatePixel: function(position) {
      var color = app.component.pallet.getColor()
      var pixelID = position.x + 'x' + position.y
      var pixel = app.image.pixels[pixelID]

      if(pixel) {
         pixel.color = app.utility.addHSLColor(pixel.color, color)
      } else {
         pixel = { position, color }
         app.image.pixels[pixelID] = pixel
      }
      pixel.colorString = app.utility.hslaToString(pixel.color)
      app.component.canvas.updateImage(app.image)
   },

   setCursor: function(options) {
      app.component.cursor.update(options)
   }
}
