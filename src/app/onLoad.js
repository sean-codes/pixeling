app.onLoad = function() {
   document.querySelector('.loading').style.display = 'none'

   app.initializeUI()

   app.ui.toolbox.selectTool('draw')
   app.command.create({
      width: 48,
      height: 48
   })

   app.keyboard.listen()
}
