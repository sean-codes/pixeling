class Layout {
   constructor(htmlContainer) {
      this.htmlContainer = htmlContainer
      this.createHTMLContainers()
   }

   appendUI(bakedUIHTML, containerName) {
      var container = this.bakedHTML.find('layout_' + containerName)
      container.append(bakedUIHTML)
   }

   createHTMLContainers() {
      // think im going to regret this manuever...
      this.bakedHTML = app.bakeHTML({
         classes: [ 'layout' ]
      })

      var bakedHTMLAppbar = app.bakeHTML({
         name: 'layout_appbar',
         classes: [ 'row' ]
      })

      var bakedHTMLCenter = app.bakeHTML({
         classes: [ 'row', 'flex' ],
         ingredients: [
            {
               name: 'layout_pallet',
               classes: [ 'column' ]
            },
            {
               name: 'layout_easel',
               classes: [ 'column', 'fill' ]
            },
            {
               name: 'layout_toolbox',
               classes: [ 'column' ]
            }
         ]
      })

      var bakedHTMLStatusbar = app.bakeHTML({
         name: 'layout_statusbar',
         classes: [ 'row' ]
      })

      // append
      this.bakedHTML.append(bakedHTMLAppbar)
      this.bakedHTML.append(bakedHTMLCenter)
      this.bakedHTML.append(bakedHTMLStatusbar)

      //append to contianer
      this.bakedHTML.appendTo(this.htmlContainer)
   }
}

/*
<div class="layout">
   <div class="row">
      <div class="appbar">pixel art editor</div>
   </div>
   <div class="row flex">
      <div class="column">
         <div class="pallet"></div>
      </div>
      <div class="column fill">
         <div class="easel"></div>
      </div>
      <div class="column">
         <div class="toolbox"></div>
      </div>
   </div>
   <div class="row">
      <div class="statusbar"></div>
   </div>
</div>
*/
