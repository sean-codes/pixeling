class Appbar extends Base {
   constructor(options = {}) {
      super()
      this.title = options.title || 'pixeling'
      this.makeHTML()
      this.onOpen = options.onOpen || function() {}
   }

   openMenu() {
      this.onOpen()
   }

   makeHTML() {
      var htmlRecipe = {
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

      this.bakedHTML = this.bakeHTML(htmlRecipe)
   }
}
