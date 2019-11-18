class ContextMenu extends Base {
   constructor(options) {
      super()
      this.bakeHTML()

      this.eleMenu = this.bakedHTML.ele('contextMenu')
      this.onCommand = options.onCommand
   }

   show() {
      var elePreview = this.bakedHTML.ele('preview')
      this.eleMenu.classList.add('show')
   }

   hide() {
      this.eleMenu.classList.remove('show')
   }

   handleClickCopy() {

   }

   handleClickedPaste() {
      console.log('clicked copy')
   }

   handleClickedFlipH() {
      console.log('clicked copy')
   }

   handleClickedFlipH() {
      console.log('clicked copy')
   }

   recipe() {
      return {
         classes: ['ui', 'context-menu'],
         name: 'contextMenu',
         ingredients: [
            {
               name: 'copy',
               tag: 'div',
               innerHTML: 'copy',
               classes: ['button'],
               events: {
                  click: () => this.onCommand('copy')
               },
            },
            {
               name: 'paste',
               tag: 'div',
               classes: ['button'],
               innerHTML: 'paste',
               events: {
                  click: () => this.onCommand('paste')
               },
            },
            {
               name: 'flip',
               tag: 'div',
               classes: ['button'],
               innerHTML: 'flip h',
               events: {
                  click: () => this.onCommand('flipHorizontal')
               },
            },
            {
               name: 'flip',
               tag: 'div',
               classes: ['button'],
               innerHTML: 'flip v',
               events: {
                  click: () => this.onCommand('flipVertical')
               },
            }
         ]
      }
   }
}
