app.command = {
   createDialog: function() {
      app.ui.dialogNew.open()
   },
   create: function(options) {
      app.image.create(options.width, options.height)

      app.ui.canvas.updateImage(app.image)
      app.ui.cursor.updateImage(app.image)
      app.ui.easel.centerCanvas()
   },
   openDialog: function() {
      app.ui.dialogOpen.open()
   },
   center: function() {
      app.ui.easel.centerCanvas()
   },
   zoomIn: function() {
      app.ui.easel.zoomIn()
      app.ui.easel.centerCanvas()
   },
   zoomOut: function() {
      app.ui.easel.zoomOut()
      app.ui.easel.centerCanvas()
   },
   zoomReset: function() {
      app.ui.easel.zoomReset()
      app.ui.easel.centerCanvas()
   },
   copy: function() {
      var selected = app.ui.cursor.selected
      if(selected) {
         var copy = app.clipboard.copy(selected)
         console.log('copy: added to clipboard', copy)
      }
   },
   paste: function() {
      app.clipboard.paste()
   },
   selectTool: function(info) {
      console.log('command: select tool', info)
      app.ui.toolbox.selectTool(info.tool)
   }
}
