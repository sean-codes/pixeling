app.history = {
   store: [],
   point: -1,
   load: function() {
      var history = JSON.parse(this.store[this.point])
      app.ui.toolbox.selectTool(history.tool)
      app.ui.cursor.update({ selected: history.selected })
      app.image.pixels = history.pixels
      app.image.width = history.width
      app.image.height = history.height
      app.ui.canvas.updateImage(app.image)
   },

   create: function() {
      // add tool, select, image
      return JSON.stringify({
         id: Math.random(),
         tool: app.ui.toolbox.currentTool.name,
         selected: app.ui.cursor.selected,
         pixels: app.image.pixels,
         width: app.image.width,
         height: app.image.height
      })
   },

   push: function() {
      // removing the forward history
      this.point += 1
      this.store = this.store.slice(0, this.point)

      var newHistory = app.history.create()
      this.store.push(newHistory)
   },

   rewrite: function() {
      app.history.store.pop()
      app.history.push()
   },

   undo: function() {
      this.point = Math.max(0, this.point - 1)
      this.load()
   },

   redo: function() {
      this.point = Math.min(this.point + 1, app.history.store.length - 1)
      this.load()
   },

   last: function() {
      return this.store[this.store.length - 1]
   }
}
