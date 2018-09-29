class Menu extends Base {
   constructor() {
      super()

      this.menuItems = [
         {
            label: 'create'
         },
         {
            label: 'export'
         },
         {
            label: 'edit',
            menuItems: [
               {
                  label: 'copy'
               },
               {
                  label: 'cut'
               },
               {
                  label: 'flip'
               }
            ]
         }
      ]

      this.bakeHTML()
   }

   toggle() {
      var eleMenu = this.bakedHTML.ele('menu')
      eleMenu.classList.toggle('hide')
   }

   recipe() {
      var recipeMenuItems = this.menuItems.map((item, i) => ({
         classes: ['menuitem'],
         innerHTML: item.label
      }))

      return {
         name: 'menu',
         classes: ['ui', 'menu', 'hide'],
         ingredients: recipeMenuItems
      }
   }
}
