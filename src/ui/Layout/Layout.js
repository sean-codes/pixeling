class Layout {
   constructor(container) {
      this.html = {
         container: container
      }
      this.createHTMLContainers()
   }

   appendUI(htmlUI, containerName) {
      //this.html.
      console.log(htmlUI, containerName)
      this.html[containerName].appendChild(htmlUI)
   }

   createHTMLContainers() {
      // think im going to regret this manuever...
      this.baked = {}
      this.baked.layout = app.bakeHTML([
         {
            classes: [ 'layout' ]
         }
      ])

      this.baked.appbarRow = app.bakeHTML([
         {
            classes: [ 'row' ],
            children: [ { classes: [ 'appbar'] }]
         }
      ])

      this.baked.centerRow = app.bakeHTML([
         {
            classes: [ 'row', 'flex' ],
            children: [
               {
                  classes: [ 'column' ],
                  children: [ { classes: ['pallet'] }]
               },
               {
                  classes: [ 'column', 'fill' ],
                  children: [ { classes: ['easel'] }]
               },
               {
                  classes: [ 'column' ],
                  children: [ { classes: ['toolbox'] }]
               }
            ]
         }
      ])

      this.baked.statusbarRow = app.bakeHTML([
         {
            classes: [ 'row' ],
            children: [ { classes: [ 'statusbar'] }]
         }
      ])

      this.html.layout = this.baked.layout.first()
      this.html.appbar = this.baked.appbarRow.find('.appbar')
      this.html.pallet = this.baked.centerRow.find('.pallet')
      this.html.easel = this.baked.centerRow.find('.easel')
      this.html.toolbox = this.baked.centerRow.find('.toolbox')
      this.html.statusbar = this.baked.statusbarRow.find('.statusbar')
      console.log(this.html)
      // append
      this.baked.layout.appendTo(this.html.container)
      this.baked.appbarRow.appendTo(this.html.layout)
      this.baked.centerRow.appendTo(this.html.layout)
      this.baked.statusbarRow.appendTo(this.html.layout)
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
