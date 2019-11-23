class Appbar extends Base {
   constructor(options = {}) {
      super()
      this.title = options.title || 'pixeling'
      this.onOpen = options.onOpen || function() {}
      this.onUndo = options.onUndo || function() {}
      this.onRedo = options.onRedo || function() {}
      this.bakeHTML()
   }

   recipe() {
      return {
         classes: ['appbar'],
         ingredients: [
            {
               classes: ['menubtn'],
               events: {
                  click: this.onOpen.bind(this)
               }
            },
            {
               classes: ['title'],
               innerHTML: this.title
            },
            {
               classes: ['quick-edit'],
               ingredients: [
                  {
                     classes: ['btn'],
                     innerHTML: 'undo',
                     events: {
                        click: this.onUndo.bind(this)
                     }
                  },
                  {
                     classes: ['btn'],
                     innerHTML: 'redo',
                     events: {
                        click: this.onRedo.bind(this)
                     }
                  }
               ]
            }
         ]
      }
   }
}
