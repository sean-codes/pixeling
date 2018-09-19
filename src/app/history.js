app.history = {
   store: [],
   point: 0,

   load: function(history) {
      app.component.toolbox.selectTool(history.tool)
      app.component.cursor.update({ selected: history.selected })
      app.image = history.image
      app.component.canvas.updateImage(history.image)
   },

   create: function() {
      return app.utility.clone({
         tool: app.component.toolbox.currentTool.name,
         selected: app.component.cursor.selected,
         image: app.image,
      })
   },

   push: function() {
      // add tool, select, image
      var newHistory = app.history.create()
      app.history.store.push(newHistory)
   },

   rewrite: function() {
      app.history.store.pop()
      app.history.push()
   },

   undo: function() {
      var lastHistory = app.history.store.pop()
      console.log(lastHistory.image)
      this.load(lastHistory)
   },

   last: function() {
      return this.store[this.store.length - 1]
   }
}
