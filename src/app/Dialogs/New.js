app.dialogs.New = {
   title: 'create sprite',
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
         label: 'create',
         onClick: (data) => {
            app.ui.dialogNew.hide()
            app.command.create({
               width: Number(data.width.value),
               height: Number(data.height.value)
            })
         }
      },
      {
         label: 'cancel',
         onClick: (data) => {
            app.ui.dialogNew.hide()
         }
      }
   ]
}
