app.dialogs.Canvas = {
   title: 'set canvas size',
   inputs: [
      {
         label: 'width',
         input: {
            name: 'width',
            type: 'number',
            min: 1,
            value: () => { return app.image.width }
         }
      },
      {
         label: 'height',
         input: {
            name: 'height',
            type: 'number',
            min: 1,
            value: () => { return app.image.height }
         }
      }
   ],
   actions: [
      {
         label: 'update',
         onClick: (data) => {
            app.ui.dialogCanvas.hide()
            app.image.setCanvasSize(data.width.value, data.height.value)
            app.ui.canvas.updateImage(app.image)
            app.ui.cursor.updateImage(app.image)
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
