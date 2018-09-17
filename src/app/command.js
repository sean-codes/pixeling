app.command = {
   copy: function() {
      var selected = app.component.cursor.selected
      if(selected) {
         console.log('copying: ' + selected)
         for(var x = selected.x; x < selected.x+selected.width; x++) {

         }
      }
   }
}
