app.initComponents = function() {
   // set components

   app.ui = {}
   app.ui.layout = new Layout(document.body)

   app.ui.appbar = new Appbar()

   app.ui.statusbar = new Statusbar({
      status: {
         color: '[ hsla() ]',
         pos: '[ pos: 0, 0 ]',
         scale: '[ scale: 1x ]',
      }
   })

   app.ui.toolbox = new Toolbox({
      initialTool: 'draw',
      tools: [
         { name: 'select', icon: 'select', overrides : app.tools.select  },
         { name: 'draw', icon: 'draw', overrides : app.tools.draw },
         { name: 'eraser', icon: 'eraser', overrides : app.tools.eraser  },
         { name: 'read', icon: 'read', overrides : app.tools.read  },
      ],
   })

   app.ui.colorMixer = new ColorMixer()
   app.ui.pallet = new Pallet({
      mixer: app.ui.colorMixer,
      onChangeColor: (color) => {
         // var colorString = app.image.hslaToString(color)
         // app.ui.statusbar.updateStatus({ color: `[ color: ${colorString} ]` })
         // app.ui.cursor.update({ color: colorString })
         // app.ui.toolbox.selectTool('draw')
      },
      onChangeSize: (size) => {
         // app.ui.cursor.update({ size })
      }
   })

   app.ui.layout.appendUI(app.ui.appbar.bakedHTML, 'appbar')
   app.ui.layout.appendUI(app.ui.statusbar.bakedHTML, 'statusbar')
   app.ui.layout.appendUI(app.ui.toolbox.bakedHTML, 'toolbox')
   app.ui.layout.appendUI(app.ui.pallet.bakedHTML, 'pallet')
   return
   //
   //
   // app.ui.cursor = new Cursor({
   //    onDown: (mouse) => {
   //       app.ui.toolbox.down(mouse)
   //    },
   //    onUp: (mouse) => {
   //       app.ui.toolbox.up(mouse)
   //    },
   //    onStroke: (mouse) => {
   //       app.ui.toolbox.stroke(mouse)
   //    },
   //    onMove: (mouse) => {
   //       app.ui.toolbox.move(mouse)
   //       app.ui.statusbar.updateStatus({
   //          pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
   //       })
   //    }
   // })
   //
   // app.ui.canvas = new Canvas({ image: app.image })
   //
   // app.ui.easel = new Easel({
   //    canvas: app.ui.canvas,
   //    cursor: app.ui.cursor,
   //    onScale: (scale) => {
   //       app.ui.cursor.updateScale(scale)
   //       app.ui.canvas.updateScale(scale)
   //       app.ui.statusbar.updateStatus({
   //          scale: `[ scale: ${scale}x ]`
   //       })
   //    }
   // })
   //

   //
   //
   // app.ui.layout.appendUI(app.ui.appbar.html, 'appbar')
   // app.ui.layout.appendUI(app.ui.pallet.html, 'pallet')
   // app.ui.layout.appendUI(app.ui.easel.html, 'easel')
   // app.ui.layout.appendUI(app.ui.toolbox.html, 'toolbox')
   // app.ui.layout.appendUI(app.ui.statusbar.html, 'statusbar')
   //
   // app.ui.easel.centerCanvas()

   app.image.create(48, 32)
   app.ui.canvas.updateImage(app.image)
}
