app.keyboard = {
   getHint: function() {
      var hint = ''

      return hint
   },

   listen: function() {
      document.body.addEventListener('keydown', app.keyboard.event)
   },

   event: function(e) {

      var modifiers = []
      if(e.altKey) modifiers.push('alt')
      if(e.ctrlKey) modifiers.push('ctrl')
      if(e.metaKey) modifiers.push('meta')
      if(e.shiftKey) modifiers.push('shift')
      
      app.keyboard.down(modifiers, e.key.toLowerCase(), e)
   },

   down: function(modifiers, key, e) {
      for(var keybind of app.config.keybinds) {
         // figure if the match
         var keybindString = JSON.stringify(keybind.modifiers.sort())
         var keydownString = JSON.stringify(modifiers.sort())
         var match = keybindString == keydownString && key == keybind.key // lol weak :]

         if(match) {
            e.preventDefault()
            app.command[keybind.command](keybind.info)
         }
      }
   }
}
