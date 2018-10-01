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
   export: function() {
      app.tools.select.unsetSelected() // when you find this.. sorry <3

      var base64 = app.image.export()
      var link = document.createElement('a')
      link.setAttribute('href', base64)
      link.setAttribute('download', 'pixeling.png')
      link.click()
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
