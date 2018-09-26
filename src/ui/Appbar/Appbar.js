class Appbar {
   constructor(options = {}) {
      this.title = options.title || 'pixel art editor'
      this.makeHTML()
   }

   makeHTML() {
      var htmlRecipe = [ { innerHTML: this.title } ]
      var bakedHTML = app.bakeHTML(htmlRecipe)

      this.html = bakedHTML.first()
   }
}
