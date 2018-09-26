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
      var batchCookingRecipe = [
         {
            classes: ['statusbar'],
            children: this.status.map((status) => {
               return {
                  classes: ['status'],
                  innerHTML: status.innerHTML
               }
            })
         }
      ]

      var bakedHTML = app.bakeHTML(batchCookingRecipe)
      this.html = bakedHTML.first()

      for(var id = 0; id < this.html.children.length; id++) {
         this.status[id].element = this.html.children[id]
      }
   }
}
