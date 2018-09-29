class Layout extends Base {
   constructor(htmlContainer) {
      super()
      this.htmlContainer = htmlContainer
      this.createHTMLContainers()
   }

   appendUI(bakedUIHTML, containerName) {
      var container = this.bakedHTML.find('layout_' + containerName)
      container.append(bakedUIHTML)
   }

   createHTMLContainers() {
      // think im going to regret this manuever...
      this.bakedHTML = this.bakeHTML({
         classes: [ 'layout' ]
      })

      var bakedHTMLAppbar = this.bakeHTML({
         name: 'layout_appbar',
         classes: [ 'row' ]
      })

      var bakedHTMLCenter = this.bakeHTML({
         classes: [ 'row', 'flex' ],
         ingredients: [
            {
               name: 'layout_pallet',
               classes: [ 'column' ]
            },
            {
               name: 'layout_easel',
               classes: [ 'column', 'fill' ]
            },
            {
               name: 'layout_toolbox',
               classes: [ 'column' ]
            }
         ]
      })

      var bakedHTMLStatusbar = this.bakeHTML({
         name: 'layout_statusbar',
         classes: [ 'row' ]
      })

      // append
      this.bakedHTML.append(bakedHTMLAppbar)
      this.bakedHTML.append(bakedHTMLCenter)
      this.bakedHTML.append(bakedHTMLStatusbar)

      //append to contianer
      this.bakedHTML.appendTo(this.htmlContainer)
   }
}
