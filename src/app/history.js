app.history = {
   store: [],
   point: 0,

   load: function(history) {
      app.ui.toolbox.selectTool(history.tool)
      app.ui.cursor.update({ selected: history.selected })
      app.image.pixels = history.pixels
      app.image.width = history.width
      app.image.height = history.height
      app.ui.canvas.updateImage(app.image)
   },

   create: function() {
      return app.clone({
         tool: app.ui.toolbox.currentTool.name,
         selected: app.ui.cursor.selected,
         pixels: app.image.pixels,
         width: app.image.width,
         height: app.image.height
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
      this.load(lastHistory)
   },

   last: function() {
      return this.store[this.store.length - 1]
   }
}
