class Dialog extends Base {
   constructor(options) {
      super()
      this.title = options.title
      this.inputs = options.inputs
      this.actions = options.actions
      this.bakeHTML()
   }

   open() {
      this.bakedHTML.element.classList.remove('hide')

      // loop default input values
      for(var input of this.inputs) {
         var eleInput = this.bakedHTML.ele('input_'+input.label)
         input.click && eleInput.click()
         if(!input.input.value) continue
         eleInput.value = input.input.value()
      }
   }

   hide() {
      this.bakedHTML.element.classList.add('hide')
   }

   setInput(name, value) {
      var eleInput = this.bakedHTML.ele('input_'+name)
      //eleInput.value = value
   }

   gatherData() {
      var formData = {}

      for(var input of this.inputs) {
         var eleInput = this.bakedHTML.ele('input_'+input.label)
         formData[eleInput.getAttribute('name')] = {
            element: eleInput,
            value: eleInput.value
         }
      }

      return formData
   }

   recipe() {
      return {
         classes: ['ui', 'dialog', 'hide'],
         ingredients: [
            {
               classes: ['container'],
               ingredients: [
                  {
                     classes: ['title'],
                     innerHTML: this.title
                  },
                  {
                     classes: ['body'],
                     ingredients: this.recipeFormInputs()
                  },
                  {
                     classes: ['actions'],
                     ingredients: this.recipeFormActions()
                  }
               ]
            }
         ]
      }
   }

   recipeFormInputs() {
      return this.inputs.reduce((recipe, ingredient) => {
         // a label
         recipe.push({
            tag: 'label',
            innerHTML: ingredient.label
         })

         // the input
         var inputRecipe = {
            tag: 'input',
            name: 'input_'+ingredient.label,
            attr: {
               name: ingredient.name,
               type: ingredient.type || 'text'
            }
         }

         for(var attr in ingredient.input) {
            if(attr == 'value') continue
            inputRecipe.attr[attr] = ingredient.input[attr]
         }

         recipe.push(inputRecipe)

         return recipe
      }, [])
   }

   recipeFormActions() {
      return this.actions.map((action) => ({
         classes: ['action'],
         innerHTML: action.label,
         events: {
            click: () => { action.onClick(this.gatherData()) }
         }
      }))
   }
}
