app.onLoad = function() {
   document.querySelector('.loading').style.display = 'none'
   app.initializeUI()

   app.image.create(48, 32)
   app.ui.canvas.updateImage(app.image)
   app.ui.easel.centerCanvas()

   app.keyboard.listen()
}
