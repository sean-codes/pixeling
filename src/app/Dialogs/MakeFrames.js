app.dialogs.MakeFrames = {
   title: 'make frames',
   inputs: [
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
         label: 'split',
         onClick: (data) => {
            app.ui.dialogMakeFrames.hide()
            
            if (app.frames.list.length == 1) {
               app.frames.load(app.frames.list[0].canvas, data.frames.value)
               app.updateFrames()
               app.ui.easel.centerCanvas()
               app.ui.easel.fitCanvas()
            }
         }
      },
      {
         label: 'cancel',
         onClick: (data) => {
            app.ui.dialogMakeFrames.hide()
         }
      }
   ]
}
