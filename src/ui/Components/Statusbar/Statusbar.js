class Statusbar extends Base  {
   constructor(options) {
      super()
      this.setupStatusArray(options.status)
      this.bakeHTML()
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
         var statusElement = this.bakedHTML.ele('status_'+statusName)
         statusElement.innerHTML = newStatusObject[statusName]
      }
   }

   recipe() {
      var statusRecipes = this.status.map((status) => ({
         name: 'status_'+status.name,
         classes: ['status'],
         innerHTML: status.innerHTML
      }))

      return {
         classes: ['statusbar'],
         ingredients: statusRecipes
      }
   }
}
