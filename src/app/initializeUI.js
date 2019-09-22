app.initializeUI = function() {

   app.ui = {}

   // create all the ui components
   app.ui.layout = new Layout(document.body)

   app.ui.menu = new Menu({
      menu: app.config.menu,
      onClick: (label) => {
         app.ui.menu.navigate('home')
         app.ui.menu.toggle()
         app.command[label] && app.command[label]()
      }
   })

   app.ui.appbar = new Appbar({
      onOpen: () => {
         app.ui.menu.toggle()
      }
   })

   app.ui.statusbar = new Statusbar({
      status: {
         color: '[ hsla() ]',
         pos: '[ pos: 0, 0 ]',
         scale: '[ scale: 10x ]',
      }
   })

   app.ui.toolbox = new Toolbox({
      initialTool: 'line',
      tools: [
         { name: 'select', icon: 'select', overrides : app.tools.select, hint: 'shortcut: s' },
         { name: 'draw', icon: 'draw', overrides : app.tools.draw, hint: 'shortcut: d' },
         { name: 'line', icon: 'line', overrides : app.tools.line, hint: 'shortcut: l' },
         { name: 'rectangle', icon: 'rectangle', overrides : app.tools.rectangle, hint: 'shortcut: r' },
         { name: 'fill', icon: 'fill', overrides : app.tools.fill, hint: 'shortcut: f'  },
         { name: 'eraser', icon: 'eraser', overrides : app.tools.eraser, hint: 'shortcut: e'  },
         { name: 'read', icon: 'read', overrides : app.tools.read, hint: 'shortcut: i'  },
      ],
   })

   app.ui.cursor = new Cursor({
      onDown: (mouse) => { app.ui.toolbox.down(mouse) },
      onUp: (mouse) => {
         app.ui.toolbox.up(mouse)

         if (app.switchedToEraserFrom) {
            app.ui.toolbox.selectTool(app.switchedToEraserFrom)
            app.switchedToEraserFrom = undefined
         }
      },
      onStroke: (mouse) => {
         app.ui.statusbar.updateStatus({
            pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
         })
         app.ui.toolbox.stroke(mouse)
      },
      onMove: (mouse) => {
         app.ui.toolbox.move(mouse)
         app.ui.statusbar.updateStatus({
            pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
         })
      },
      onEraserDown: () => {
         console.log('eraser down!!!')
         app.switchedToEraserFrom = app.ui.toolbox.currentTool.name
         app.ui.toolbox.selectTool('eraser')
      }
   })

   app.ui.canvas = new Canvas()

   app.ui.easel = new Easel({
      uiCanvas: app.ui.canvas,
      uiCursor: app.ui.cursor,
      onScale: (scale) => {
         app.ui.statusbar.updateStatus({
            scale: `[ scale: ${scale}x ]`
         })
      },
      onPassEventMousedown: e => app.ui.cursor.onEventMousedown(e),
      onPassEventMousemove: e => app.ui.cursor.onEventMousemove(e),
      onPassEventMouseup: e => app.ui.cursor.onEventMouseup(e),
      onPassEventMouseleave: e => app.ui.cursor.onEventMouseleave(e)
   })

   app.ui.colorMixer = new ColorMixer()
   app.ui.pallet = new Pallet({
      mixer: app.ui.colorMixer,
      onChangeColor: (color) => {
         var colorString = app.util.hslaToString(color)
         app.rgba = app.util.hslaToRgba(color.h, color.s, color.l, color.a)
         app.colorString = colorString
         app.ui.statusbar.updateStatus({ color: `[ color: ${colorString} ]` })
         app.ui.cursor.updateColor(colorString)
      },
      onChangeSize: (size) => {
         app.cursorSize = size
         app.ui.cursor.update({ size })
      }
   })

   app.ui.frames = new Frames({
      frames: app.frames,
      addFrame: () => {
         app.tools.select.unsetSelected()
         app.frames.addFrame()
         app.frames.currentFrame = app.frames.list.length - 1
         app.updateFrames()
         app.history.push()
      },
      selectFrame: (clickedFrameID) => {
         app.tools.select.unsetSelected()
         app.frames.currentFrame = clickedFrameID
         app.updateFrames()
      },
      deleteFrame: (deleteFrameID) => {
         app.tools.select.unsetSelected()
         app.frames.deleteFrame(deleteFrameID)
         app.updateFrames()
         app.history.push()
      }
   })

   app.ui.preview = new Preview()

   // append all the ui components
   app.ui.layout.appendUI(app.ui.menu.bakedHTML, 'sidebar')
   app.ui.layout.appendUI(app.ui.appbar.bakedHTML, 'top')
   app.ui.layout.appendUI(app.ui.statusbar.bakedHTML, 'bottom')
   app.ui.layout.appendUI(app.ui.toolbox.bakedHTML, 'workspace_dockright')
   app.ui.layout.appendUI(app.ui.frames.bakedHTML, 'workspace_docktop')
   app.ui.layout.appendUI(app.ui.pallet.bakedHTML, 'workspace_dockleft')
   app.ui.layout.appendUI(app.ui.easel.bakedHTML, 'workspace_dockbottom')
   app.ui.layout.appendUI(app.ui.preview.bakedHTML, 'workspace_dockbottom')

   // app.ui.dialogNew = new Dialog(app.dialogs.New)
   // app.ui.layout.appendUI(app.ui.dialogNew.bakedHTML, 'menu')
   // you are really lazy :]
   for(var dialogName in app.dialogs) {
      app.ui['dialog'+dialogName] = new Dialog(app.dialogs[dialogName])
      app.ui.layout.appendUI(app.ui['dialog'+dialogName].bakedHTML, 'top')
   }

   // append to body
   app.ui.layout.bakedHTML.appendTo(document.body)
}
