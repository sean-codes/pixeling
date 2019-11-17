class Menu extends Base {
   constructor(options) {
      super()
      this.onClick = options.onClick || function(){}
      this.menuGroups = options.menu


      this.bakeHTML()
      this.current = 'home'
      this.navigate(this.current)
   }

   toggle() {
      this.navigate('home')
      var eleMenu = this.bakedHTML.ele('menu')
      eleMenu.classList.toggle('hide')
   }

   eventClickMenuItem(e, bakedHTML) {
      var action = bakedHTML.data('command')
      var to = bakedHTML.data('to')
      var stayOpen = bakedHTML.data('stay_open')

      if(to) {
         var transition = bakedHTML.data('transition')
         this.navigate(to, transition)
      } else {
         if (!stayOpen) {
            app.ui.menu.navigate('home')
            this.toggle()
         }
         
         this.onClick(action)
      }
   }

   navigate(to, transition) {
      var eleGroupFrom = this.bakedHTML.ele('group_'+this.current)
      eleGroupFrom.classList.remove('current')
      if(transition) eleGroupFrom.classList.add('from_'+transition)
      if(!transition) this.resetTransitions()

      var eleGroupTo = this.bakedHTML.ele('group_'+to)
      eleGroupTo.classList.add('current')
      eleGroupTo.classList.remove('from_forward')
      eleGroupTo.classList.remove('from_backward')
      this.current = to
   }

   resetTransitions() {
      for(var group of this.bakedHTML.ingredients) {
         group.element.classList.remove('from_forward')
         group.element.classList.remove('from_backward')
      }
   }

   recipe() {
      var recipeMenuGroups = this.menuGroups.map((group) => {
         var recipeMenuItems = group.items.map((item) => ({
            classes: ['item', 'to_'+item.transition],
            innerHTML: item.label,
            ingredients: [
               {
                  classes: ['hint'],
                  innerHTML: item.hint
               }
            ],
            data: {
               to: item.to,
               transition: item.transition,
               command: item.command,
               stay_open: item.stay_open,
            },
            events: {
               click: this.eventClickMenuItem.bind(this)
            }
         }))

         return {
            classes: ['group'],
            name: 'group_'+group.name,
            ingredients: recipeMenuItems
         }
      })

      return {
         name: 'menu',
         classes: ['ui', 'menu', 'hide'],
         ingredients: recipeMenuGroups
      }
   }
}
