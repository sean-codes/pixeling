class Appbar {
   constructor(options = {}) {
      this.title = options.title || 'pixel art editor'
      this.makeHTML()
   }

   openMenu() {
      console.log('open menu')
   }

   makeHTML() {
      var htmlRecipe = {
         classes: ['appbar'],
         ingredients: [
            {
               classes: ['menubtn'],
               innerHTML: 'menu',
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

      this.bakedHTML = app.bakeHTML(htmlRecipe)
   }
}
