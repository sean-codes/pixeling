class Statusbar {
   constructor(html, options) {
      this.html = html

      this.setupStatusArray(options.status)
      this.createStatusElements(options.status)
   }

   setupStatusArray(status) {
      this.status = []

      var cloneStatus = JSON.parse(JSON.stringify(status))
      for(var cloneStatusKey in cloneStatus) {
         this.status.push({
            name: cloneStatusKey,
            innerHTML: cloneStatus[cloneStatusKey]
         })
      }
   }

   updateStatus(newStatusObject) {
      for(var statusName in newStatusObject) {
         for(var status of this.status) {
            if(status.name == statusName) {
               status.element.innerHTML = newStatusObject[statusName]
               break
            }
         }
      }
   }

   createStatusElements() {
      var batchCookingRecipe = this.status.map((status) => {
         return {
            classes: ['status'],
            innerHTML: status.innerHTML
         }
      })

      var bakedHTML = app.bakeHTML(batchCookingRecipe)
      bakedHTML.appendTo(this.html)

      for(var elementID in bakedHTML.elements) {
         this.status[elementID].element = bakedHTML.elements[elementID]
      }
   }
}
