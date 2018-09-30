app.onLoad = function() {
   document.querySelector('.loading').style.display = 'none'
   app.initializeUI()


   app.command.create({
      width: 48,
      height: 32
   })

   app.keyboard.listen()
}
