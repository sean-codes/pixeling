// Needs finished. I find I never really use this feature. Could be handy!
class Filedrop extends Base {
   constructor() {
      super()

      this.bakeHTML()
   }

   recipe() {
      return {
         classes: [ 'ui', 'filedrop' ],
         ingredients: [
            {
               classes: ['help'],
               innerHTML: 'drop to open your artwork!'
            }
         ]
      }
   }
}
