app.onLoad = function() {
   document.querySelector('.loading').style.display = 'none'
   app.open.init()
   app.initializeUI()

   app.ui.toolbox.selectTool('draw')


   app.history.hardLoad()
      .then(() => {
         app.ui.easel.centerCanvas()
         app.ui.easel.fitCanvas()
      })
      .catch(() => {
         app.command.create({
            width: 48,
            height: 48
         })
      })

   app.keyboard.listen()
}
