app.dialogs.New = {
   title: 'create sprite',
   inputs: [
      {
         label: 'width',
         input: {
            name: 'width',
            type: 'number',
            min: 1,
            value: 32
         }
      },
      {
         label: 'height',
         input: {
            name: 'height',
            type: 'number',
            min: 1,
            value: 32
         }
      }
   ],
   actions: [
      {
         label: 'create',
         onClick: (data) => {
            app.ui.dialogNew.hide()
            app.command.create({
               width: data.width.value,
               height: data.height.value
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
