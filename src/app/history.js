app.history = {
   store: [],
   point: 0,

   load: function(history) {
      app.ui.toolbox.selectTool(history.tool)
      app.ui.cursor.update({ selected: history.selected })
      app.image = history.image
      app.ui.canvas.updateImage(history.image)
   },

   create: function() {
      return app.clone({
         tool: app.ui.toolbox.currentTool.name,
         selected: app.ui.cursor.selected,
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
