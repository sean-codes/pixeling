app.command = {
   toggleFrames: function() {
      app.ui.frames.toggle()
   },

   togglePreview: function() {
      console.log('wtf')
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

      app.ui.canvas.updateImage(app.frames.getCurrentFrame())
      app.ui.cursor.updateImage(app.frames.getCurrentFrame())
      app.ui.easel.centerCanvas()
      app.ui.frames.setFrames(app.frames.list, app.frames.currentFrame)
      app.ui.preview.setFrames(app.frames.list, app.frames.currentFrame)
      app.history.push()
   },

   export: function() {
      app.tools.select.unsetSelected() // when you find this.. sorry <3

      var base64 = app.frames.export()
      var link = document.createElement('a')
      link.setAttribute('href', base64)
      link.setAttribute('download', 'pixeling.png')
      link.click()
   },

   openDialog: function() {
      app.ui.dialogOpen.open()
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
         var copy = app.clipboard.copy(selected)
         console.log('copy: added to clipboard', copy)
      }
   },

   paste: function() {
      app.clipboard.paste()
      app.history.push()
   },

   selectTool: function(info) {
      console.log('command: select tool', info)
      app.ui.toolbox.selectTool(info.tool)
   },
   undo: function() {
      app.history.undo()
   },

   redo: function() {
      app.history.redo()
   },

   flipHorizontal() {
      var image = app.frames.getCurrentFrame()

      var { x, y, width, height } = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.dimensions
         : { x: 0, y: 0, width: image.width, height: image.height }

      var pixels = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.pixels
         : image.pixels

      for(var xpos = 0; xpos < Math.floor(width/2); xpos++) {
         for(var ypos = y; ypos < y + height; ypos++) {
            var pixelLeft = app.clone(pixels[x+xpos][ypos])
            var pixelRight = app.clone(pixels[(x+width)-xpos-1][ypos])

            var saveX = pixelLeft.x
            var saveY = pixelLeft.y

            pixelLeft.x = pixelRight.x
            pixelLeft.y = pixelRight.y

            pixelRight.x = saveX
            pixelRight.y = saveY

            pixels[x+xpos][ypos] = pixelRight
            pixels[(x+width)-xpos-1][ypos] = pixelLeft
         }
      }

      app.ui.canvas.updateImage(image)
      app.ui.cursor.updateImage(image)

      app.history.push()
   },

   flipVertical() {
      var image = app.frames.getCurrentFrame()

      var { x, y, width, height } = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.dimensions
         : { x: 0, y: 0, width: image.width, height: image.height }

      var pixels = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.pixels
         : image.pixels

      for(var ypos = y; ypos < y + Math.floor(height/2); ypos++) {
         for(var xpos = 0; xpos < width; xpos++) {
            // we could potention simplfy this by only swapping color/colorstring
            var yLeft = y + ypos
            var yRight = (y+height)-ypos-1

            var pixelLeft = app.clone(pixels[xpos][yLeft])
            var pixelRight = app.clone(pixels[xpos][yRight])

            var saveX = pixelLeft.x
            var saveY = pixelLeft.y

            pixelLeft.x = pixelRight.x
            pixelLeft.y = pixelRight.y

            pixelRight.x = saveX
            pixelRight.y = saveY

            pixels[xpos][yLeft] = pixelRight
            pixels[xpos][yRight] = pixelLeft
         }
      }

      app.ui.canvas.updateImage(image)
      app.ui.cursor.updateImage(image)

      app.history.push()
   },

   toggleMenu: function() {
      app.ui.menu.toggle()
   },

   toggleColorMixer() {
      app.ui.colorMixer.toggle()
   },

   delete() {
      if(app.ui.cursor.selected) {
         app.ui.cursor.update({ selected: undefined })
      }
   },

   selectAll() {
      var imageRect = app.frames.getImageRect()
      app.ui.toolbox.selectTool('select')
      app.ui.cursor.update({
         selected: {
            ...imageRect,
            copy: app.clipboard.getCopy(imageRect)
         }
      })
      app.frames.clearPixels(imageRect)

      app.ui.canvas.updateImage(app.frames.getCurrentFrame())
      app.history.push()
   },

   toggleColorMixer() {
      app.ui.colorMixer.toggle()
   },

   palletNextColor() {
      app.ui.pallet.nextColor()
   },

   palletPrevColor() {
      app.ui.pallet.prevColor()
   },

   palletIncreaseBrush() {
      app.ui.pallet.eventIncreaseBrushSize()
   },

   palletDecreaseBrush() {
      app.ui.pallet.eventDecreaseBrushSize()
   }
}
