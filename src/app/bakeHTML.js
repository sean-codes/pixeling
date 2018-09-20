app.bakeHTML = function(recipe) {
   var bakedHTML = {
      elements: [],
      appendTo: function(parent) {
         for (var element of this.elements) {
            parent.appendChild(element)
         }
      },
      first: function() {
         return this.elements[0]
      }
   }

   for (var template of recipe) {
      var element = document.createElement(template.tag || 'div')
      element.innerHTML = template.innerHTML || ''
      // add styles / classes / children / events
      for (var style in template.styles || [])
         element.style[style] = template.styles[style]

      for (var data in template.data || {}){
         element.dataset[data] = template.data[data]
      }

      for (var attr in template.attr || {}){
         element.setAttribute(attr, template.attr[attr])
      }

      for (var className of template.classes || [])
         element.classList.add(className)

      if (template.children)
         app.bakeHTML(template.children).appendTo(element)

      for(var append of template.append || [])
         element.appendChild(append)

      // let does something interesting here
      for (let eventName in template.events || []) {
         var eventCall = template.events[eventName];

         (function(element, eventName, eventCall) {
            element.addEventListener(eventName, (e) => {
               eventCall(e, element)
            })
         })(element, eventName, eventCall)
      }

      bakedHTML.elements.push(element)
   }
   return bakedHTML
}
