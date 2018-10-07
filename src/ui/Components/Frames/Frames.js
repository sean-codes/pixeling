class Frames extends Base {
   constructor() {
      super()
      this.bakeHTML()
   }

   toggle() {
      var eleContainer = this.bakedHTML.ele('container')
      eleContainer.classList.toggle('hide')
   }

   recipe() {
      return {
         name: 'container',
         classes: ['ui', 'frames', 'hide'],
         ingredients: [
            {
               classes: ['frame', 'new']
            },
            {
               classes: ['frame']
            }
         ]
      }
   }
}
