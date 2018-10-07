app.dialogs.Open = {
   title: 'open image',
   inputs: [
      {
         input: {
            name: 'file',
            type: 'file',
            accept: 'image/*'
         }
      },
   ],
   actions: [
      {
         label: 'open',
         onClick: (data) => {
            // first file
            var file = data.file.element.files[0]
            if(file)
            // read file into image
            var reader = new FileReader()
            reader.onload = (e) => {
               var image = new Image()
               image.onload = () => {
                  app.ui.dialogOpen.hide()

                  app.frames.load(image)

                  var frame = app.frames.getCurrentFrame()
                  app.ui.canvas.updateImage(frame)
                  app.ui.cursor.updateImage(frame)
                  app.ui.easel.centerCanvas()
               }
               image.src = e.target.result
            }
            reader.readAsDataURL(file)
         }
      },
      {
         label: 'cancel',
         onClick: (data) => {
            app.ui.dialogOpen.hide()
         }
      }
   ]
}
