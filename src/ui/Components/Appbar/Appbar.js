class Appbar extends Base {
   constructor(options = {}) {
      super()
      this.title = options.title || 'pixeling'
      this.bakeHTML()
      this.onOpen = options.onOpen || function() {}
   }

   openMenu() {
      this.onOpen()
   }

   recipe() {
      return {
         classes: ['appbar'],
         ingredients: [
            {
               classes: ['menubtn'],
               events: {
                  click: this.openMenu.bind(this)
               }
            },
            {
               classes: ['title'],
               innerHTML: this.title
            }
         ]
      }
   }
}
