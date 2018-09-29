app.onLoad = function() {
   app.initializeUI()

   app.image.create(48, 32)
   app.ui.canvas.updateImage(app.image)
   app.ui.easel.centerCanvas()

   app.keyboard.listen()
}
