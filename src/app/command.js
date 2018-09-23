app.command = {
   copy: function() {
      var selected = app.component.cursor.selected
      if(selected) {
         var copy = app.clipboard.copy(selected)
         console.log('copy: added to clipboard', copy)
      }
   },
   paste: function() {
      app.clipboard.paste()
   },
   selectTool: function(info) {
      console.log('command: select tool', info)
      app.component.toolbox.selectTool(info.tool)
   }
}
