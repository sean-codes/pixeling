app.command = {
   createDialog: function() {
      app.ui.dialogNew.open()
   },

   create: function(options) {
      app.image.create(options.width, options.height)

      app.ui.canvas.updateImage(app.image)
      app.ui.cursor.updateImage(app.image)
      app.ui.easel.centerCanvas()
   },

   export: function() {
      app.tools.select.unsetSelected() // when you find this.. sorry <3

      var base64 = app.image.export()
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
      var { x, y, width, height } = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.dimensions
         : { x: 0, y: 0, width: app.image.width, height: app.image.height }

      var pixels = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.pixels
         : app.image.pixels

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

      app.ui.canvas.updateImage(app.image)
      app.ui.cursor.updateImage(app.image)

      app.history.push()
   },

   flipVertical() {
      var { x, y, width, height } = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.dimensions
         : { x: 0, y: 0, width: app.image.width, height: app.image.height }

      var pixels = app.ui.cursor.selected
         ? app.ui.cursor.selected.copy.pixels
         : app.image.pixels

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

      app.ui.canvas.updateImage(app.image)
      app.ui.cursor.updateImage(app.image)

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
      var imageRect = app.image.getImageRect()
      app.ui.toolbox.selectTool('select')
      app.ui.cursor.update({
         selected: {
            ...imageRect,
            copy: app.clipboard.getCopy(imageRect)
         }
      })
      app.image.clearPixels(imageRect)
      app.history.push()
   }
}
