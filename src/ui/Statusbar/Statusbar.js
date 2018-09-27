class Statusbar {
   constructor(options) {
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
      var htmlRecipe = {
         classes: ['statusbar'],
         ingredients: this.status.map((status) => ({
            name: 'status_'+status.name,
            classes: ['status'],
            innerHTML: status.innerHTML
         }))
      }

      this.bakedHTML = app.bakeHTML(htmlRecipe)
   }
}
