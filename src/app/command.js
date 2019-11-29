app.command = {
   onionFramesDialog: function() {
      app.ui.dialogdialogOnionFrames.open()
   },

   toggleFrames: function() {
      app.ui.frames.toggle()
   },

   nextFrame: function(){
      app.ui.frames.nextFrame()
   },

   togglePreviewLoop: function() {
      app.ui.preview.togglePreviewLoop()
   },

   togglePreview: function() {
      app.ui.preview.toggle()
   },

   createDialog: function() {
      app.ui.dialogNew.open()
   },

   canvasDialog: function() {
      app.ui.dialogCanvas.open()
   },

   create: function(options) {
      app.frames.create(options.width, options.height)

      app.updateFrames()
      app.ui.easel.centerCanvas()
      app.ui.easel.fitCanvas()
      app.history.reset()
   },

   export: function() {
      app.tools.select.unsetSelected() // when you find this.. sorry <3

      var base64 = app.frames.export()
      var link = document.createElement('a')
      link.setAttribute('href', base64)
      link.setAttribute('download', app.history.name)
      link.click()
   },

   open: function() {
      app.open.request()
   },

   makeFramesDialog: function() {
      app.ui.dialogMakeFrames.open()
   },

   crop: function() {
      if(app.ui.cursor.selected) {
         var { x, y, width, height } = app.ui.cursor.selected
         app.tools.select.unsetSelected()
         app.frames.crop(x, y, width, height)

         app.updateFrames()

         app.ui.easel.centerCanvas()
         app.ui.easel.fitCanvas()
         app.history.push()
      }
   },

   center: function() {
      app.ui.easel.centerCanvas()
   },

   zoomIn: function() {
      app.ui.easel.zoomIn()
      app.ui.easel.centerCanvas()
   },

   zoomOut: function() {
      app.ui.easel.zoomOut()
      app.ui.easel.centerCanvas()
   },

   zoomReset: function() {
      app.ui.easel.zoomReset()
      app.ui.easel.centerCanvas()
   },

   copy: function() {
      var selected = app.ui.cursor.selected
      if(selected) {
         app.clipboard.copy(selected)
      }
   },

   paste: function() {
      app.clipboard.paste()
      app.history.push()
      app.ui.toolbox.selectTool('select')
   },

   selectTool: function(info) {
      app.ui.toolbox.selectTool(info.tool)
   },

   undo: function() {
      app.history.undo()
   },

   redo: function() {
      app.history.redo()
   },

   flipHorizontal: function() {
      var frame = app.frames.getCurrentFrame()
      var canvas = frame.canvas
      var ctx = frame.ctx

      if (app.ui.cursor.selected) {
         canvas = app.ui.cursor.selected.copy
         ctx = canvas.getContext('2d')
      }

      app.scratchCanvas.width = canvas.width
      app.scratchCanvas.height = canvas.height
      app.scratchCtx.drawImage(canvas, 0, 0)

      ctx.save()

      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(app.scratchCanvas, 0, 0)
      ctx.restore()

      app.updateFrames()
      if(!app.ui.cursor.selected) {
         app.history.push()
      }
   },

   flipVertical: function() {
      var frame = app.frames.getCurrentFrame()
      var canvas = frame.canvas
      var ctx = frame.ctx

      if (app.ui.cursor.selected) {
         canvas = app.ui.cursor.selected.copy
         ctx = canvas.getContext('2d')
      }

      app.scratchCanvas.width = canvas.width
      app.scratchCanvas.height = canvas.height
      app.scratchCtx.drawImage(canvas, 0, 0)

      ctx.save()

      ctx.translate(0, canvas.height)
      ctx.scale(1, -1)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(app.scratchCanvas, 0, 0)
      ctx.restore()

      app.updateFrames()
      if(!app.ui.cursor.selected) {
         app.history.push()
      }
   },

   toggleMenu: function() {
      app.ui.menu.toggle()
   },

   toggleColorMixer: function() {
      app.ui.colorMixer.toggle()
   },

   delete: function() {
      if (app.ui.cursor.selected) {
         app.ui.contextMenu.hide()
         app.ui.cursor.update({ selected: undefined })
         app.updateFrames()
         app.history.push()
      }
   },

   selectAll: function() {
      app.ui.toolbox.selectTool('select')
      app.tools.select.selectAll()
   },

   toggleColorMixer: function() {
      app.ui.colorMixer.toggle()
   },

   palletNextColor: function() {
      app.ui.pallet.nextColor()
   },

   palletPrevColor: function() {
      app.ui.pallet.prevColor()
   },

   palletIncreaseBrush: function() {
      app.ui.pallet.eventIncreaseBrushSize()
   },

   palletDecreaseBrush: function() {
      app.ui.pallet.eventDecreaseBrushSize()
   },

   toggleFullscreen: function() {
      app.fullscreen.toggle()
   }
}
