app.history = {
   store: [],
   point: -1,

   reset: function() {
      this.store = []
      this.point = -1
      this.push()
   },

   load: function() {
      var history = JSON.parse(this.store[this.point])
      // app.ui.toolbox.selectTool(history.tool)
      if(app.frames.list.length != history.frames.length) {
         app.frames.currentFrame = history.currentFrame
      }
      app.frames.list = history.frames
      app.ui.cursor.update({ selected: undefined })
      app.updateFrames()
   },

   create: function() {
      // add tool, select, image
      return JSON.stringify({
         id: Math.random(),
         //tool: app.ui.toolbox.currentTool.name,
         selected: app.ui.cursor.selected,
         frames: app.frames.list,
         currentFrame: app.frames.currentFrame
      })
   },

   push: function() {
      // add to history array
      this.point += 1
      this.store = this.store.slice(0, this.point)

      var newHistory = app.history.create()
      this.store.push(newHistory)
   },

   rewrite: function() {
      this.point -= 1
      this.push()
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
