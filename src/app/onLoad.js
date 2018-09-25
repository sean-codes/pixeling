app.onLoad = function() {
   app.initComponents()
   app.keyboard.listen()

   app.image.create(48, 32)
   app.component.canvas.updateImage(app.image)
}
