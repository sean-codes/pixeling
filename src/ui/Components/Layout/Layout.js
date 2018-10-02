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
      var recipeTop = {
         name: 'layout_top',
         classes: [ 'top' ]
      }

      var recipeBottom = {
         name: 'layout_bottom',
         classes: [ 'bottom' ]
      }

      var recipeCenter = {
         classes: [ 'center' ],
         ingredients: [
            {
               name: 'layout_sidebar',
               classes: [ 'sidebar' ]
            },
            {
               name: 'layout_workspace_dockleft',
               classes: [ 'dockright' ]
            },
            {
               name: 'layout_workspace_easel',
               classes: [ 'easel' ]
            },
            {
               name: 'layout_workspace_dockright',
               classes: [ 'dockleft' ]
            }
         ]
      }

      return {
         name: 'layout',
         classes: [ 'ui', 'layout' ],
         ingredients: [
            recipeTop,
            recipeCenter,
            recipeBottom
         ]
      }
   }
}
