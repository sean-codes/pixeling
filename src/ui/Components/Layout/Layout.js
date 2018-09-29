class Layout extends Base {
   constructor() {
      super()
      this.bakeHTML()
   }

   appendUI(bakedUIHTML, containerName) {
      var container = this.bakedHTML.find('layout_' + containerName)
      container.append(bakedUIHTML)
   }

   recipe() {
      var recipeAppbar = {
         name: 'layout_appbar',
         classes: [ 'row' ]
      }

      var recipeCenter = {
         classes: [ 'row', 'flex' ],
         ingredients: [
            {
               name: 'layout_menu',
               classes: [ 'column' ]
            },
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
      }

      var recipeStatusbar = {
         name: 'layout_statusbar',
         classes: [ 'row' ]
      }

      return {
         name: 'layout',
         classes: [ 'layout' ],
         ingredients: [
            recipeAppbar,
            recipeCenter,
            recipeStatusbar
         ]
      }
   }
}
