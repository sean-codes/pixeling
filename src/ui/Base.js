// base ui component
class Base {

   constructor() {
      // default bakedHTML
      this.bakedHTML = this.bakeHTML({})
   }

   // this is a truly evil creation
   bakeHTML(recipe) {
      var bakedHTML = {
         name: recipe.name,
         element: document.createElement(recipe.tag || 'div'),
         ingredients: [],
         append: function(bakedIngredient) {
            // loop through components
            this.ingredients.push(bakedIngredient)
            this.element.appendChild(bakedIngredient.element)
         },
         appendTo: function(parentHTMLElement) {
            parentHTMLElement.appendChild(this.element)
         },
         find: function(name) {
            if(this.name == name) return this

            for(var ingredient of this.ingredients) {
               var found = ingredient.find(name)
               if(found) return found
            }
         },
         ele: function(name) {
            var found = this.find(name)
            if(found) return found.element
         },
         data: function(name, value) {
            if(value != null) this.element.dataset[name] = value
            return this.element.dataset[name]
         }
      }

      bakedHTML.element.innerHTML = recipe.innerHTML || ''

      // add styles / classes / children / events
      for (var style in recipe.styles || [])
         bakedHTML.element.style[style] = recipe.styles[style]

      for (var data in recipe.data || {}){
         bakedHTML.element.dataset[data] = recipe.data[data]
      }

      for (var attr in recipe.attr || {}){
         bakedHTML.element.setAttribute(attr, recipe.attr[attr])
      }

      for (var className of recipe.classes || [])
         bakedHTML.element.classList.add(className)

      if (recipe.ingredients) {
         for(var ingredient of recipe.ingredients) {
            var bakedIngredient = this.bakeHTML(ingredient)
            bakedHTML.append(bakedIngredient)
         }
      }

      for(var append of recipe.append || [])
         bakedHTML.append(append)

      // let does something interesting here
      for (let eventName in recipe.events || []) {
         var eventCall = recipe.events[eventName];

         (function(element, testBakedHTML, eventName, eventCall) {
            element.addEventListener(eventName, (e) => {
               eventCall(e, testBakedHTML)
            })
         })(bakedHTML.element, bakedHTML, eventName, eventCall)
      }

      return bakedHTML
   }
}
