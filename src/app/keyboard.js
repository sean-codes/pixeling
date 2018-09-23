app.keybinds = [
   {
      modifiers: ['meta'],
      key: 'c',
      command: 'copy'
   },
   {
      modifiers: ['meta'],
      key: 'v',
      command: 'paste'
   }
]

app.keyboard = {
   listen: function() {
      document.body.addEventListener('keydown', app.keyboard.event)
   },

   event: function(e) {
      e.preventDefault()

      var modifiers = []
      if(e.altKey) modifiers.push('alt')
      if(e.ctrlKey) modifiers.push('ctrl')
      if(e.metaKey) modifiers.push('meta')
      if(e.shiftKey) modifiers.push('shift')

      app.keyboard.down(modifiers, e.key)
   },

   down: function(modifiers, key) {
      for(var keybind of app.keybinds) {
         // figure if the match
         var keybindString = JSON.stringify(keybind.modifiers.sort())
         var keydownString = JSON.stringify(modifiers.sort())
         var match = keybindString == keydownString && key == keybind.key // lol weak :]

         if(match) {
            app.command[keybind.command]()
         }
      }
   }
}
