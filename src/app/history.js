app.history = {
   store: [],
   point: -1,

   hardSave: function() {
      const hardSave = this.store.map((item) => {
         return {
            currentFrame: item.currentFrame,
            id: item.id,
            width: item.width,
            height: item.height,
            imageData: item.currentFrame,
            frames: item.frames
         }
      })

      localStorage.setItem('history', JSON.stringify(hardSave))
   },

   hardLoad: function() {
      return new Promise((yay, nay) => {
         // return false
         let store = []
         try {
            store = JSON.parse(localStorage.getItem('history'))
         } catch(e) {
            console.log('something wrong with local storage', e)
            nay()
         }

         this.store = store
         this.point = this.store.length - 1

         this.load().then(yay).catch(nay)
      })
   },


   reset: function() {
      this.store = []
      this.point = -1
      this.push()
   },

   load: function() {
      return new Promise((yay, nay) => {
         var history = this.store[this.point]

         if(app.frames.list.length != history.frames.length) {
            app.frames.currentFrame = history.currentFrame
         }

         app.frames.width = history.width
         app.frames.height = history.height

         let loading = history.frames.length
         app.frames.list = history.frames.map((frame) => {
            // load in the copy form localstorage
            const img = document.createElement('img')
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = history.width
            canvas.height = history.height
            img.src = frame.imageData
            img.onload = () => {
               ctx.drawImage(img, 0, 0)
               loading -= 1
               if (!loading) {
                  app.updateFrames(true)
                  yay()
               }
            }

            return {
               width: history.width,
               height: history.height,
               canvas: canvas,
               ctx: ctx
            }
         })

         app.ui.cursor.update({ selected: undefined })

      })
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
               imageData: frame.canvas.toDataURL(0, 0, app.frames.width, app.frames.height)
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

      this.hardSave()
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
