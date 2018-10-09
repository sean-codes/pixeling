app.dialogs.dialogOnionFrames = {
   title: 'set onion frames',
   inputs: [
      {
         label: 'layer count',
         input: {
            name: 'onion',
            type: 'number',
            min: 0,
            value: () => { return app.ui.canvas.onion }
         }
      }
   ],
   actions: [
      {
         label: 'update',
         onClick: (data) => {
            app.ui.dialogdialogOnionFrames.hide()
            app.ui.canvas.onion = Number(data.onion.value)
            app.ui.canvas.resetCanvas()
            app.ui.canvas.drawImage()
         }
      },
      {
         label: 'cancel',
         onClick: (data) => {
            app.ui.dialogdialogOnionFrames.hide()
         }
      }
   ]
}
