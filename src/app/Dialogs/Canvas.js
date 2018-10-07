app.dialogs.Canvas = {
   title: 'set canvas size',
   inputs: [
      {
         label: 'width',
         input: {
            name: 'width',
            type: 'number',
            min: 1,
            value: () => { return app.frames.width }
         }
      },
      {
         label: 'height',
         input: {
            name: 'height',
            type: 'number',
            min: 1,
            value: () => { return app.frames.height }
         }
      }
   ],
   actions: [
      {
         label: 'update',
         onClick: (data) => {
            app.ui.dialogCanvas.hide()

            var width = Number(data.width.value)
            var height = Number(data.height.value)
            app.frames.setCanvasSize(width, height)

            var image = app.frames.getCurrentFrame()
            app.ui.canvas.updateImage(image)
            app.ui.cursor.updateImage(image)
            app.history.push()
         }
      },
      {
         label: 'cancel',
         onClick: (data) => {
            app.ui.dialogCanvas.hide()
         }
      }
   ]
}
