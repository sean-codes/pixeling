app.history = {
   store: [],
   point: -1,

   reset: function() {
      this.store = []
      this.point = -1
      this.push()
   },

   load: function() {
      var history = this.store[this.point]

      if(app.frames.list.length != history.frames.length) {
         app.frames.currentFrame = history.currentFrame
      }

      app.frames.width = history.width
      app.frames.height = history.height

      app.frames.list = history.frames.map((frame) => {
         var canvas = document.createElement('canvas')
         canvas.width = history.width
         canvas.height = history.height
         var ctx = canvas.getContext('2d')

         ctx.putImageData(frame.imageData, 0, 0)

         return {
            width: history.width,
            height: history.height,
            canvas: canvas,
            ctx: ctx
         }
      })

      console.log(app.frames.list)

      app.ui.cursor.update({ selected: undefined })
      app.updateFrames()
   },

   create: function() {
      // add tool, select, image
      var selected = app.ui.cursor.selected ? {
         x: app.ui.cursor.selected.x,
         y: app.ui.cursor.selected.y,
         width: app.ui.cursor.selected.width,
         height: app.ui.cursor.selected.height
      } : undefined

      var history = {
         id: Math.random(),
         currentFrame: app.frames.currentFrame,
         selected: selected,
         width: app.frames.width,
         height: app.frames.height,
         frames: app.frames.list.map((frame) => {
            return {
               imageData: frame.ctx.getImageData(0, 0, frame.width, frame.height)
            }
         })
      }

      return history
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
