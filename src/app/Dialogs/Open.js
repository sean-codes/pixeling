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
      {
         label: 'frame count',
         input: {
            name: 'frames',
            type: 'number',
            value: () => 1
         }
      }
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
                  app.frames.load(image, data.frames.value)
                  app.history.reset()
                  app.updateFrame()
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
