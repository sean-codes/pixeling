app.initializeUI = function() {
   app.ui = {}
   app.ui.layout = new Layout(document.body)
   app.ui.dialogNew = new Dialog({
      title: 'create sprite',
      inputs: [
         {
            label: 'width',
            input: {
               type: 'number',
               min: 1,
               value: 32
            }
         },
         {
            label: 'height',
            input: {
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
               app.command.create({
                  width: data.width,
                  height: data.height
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
   })

   app.ui.menu = new Menu({
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

   app.ui.canvas = new Canvas({ image: app.image })
   app.ui.cursor = new Cursor({
      onDown: (mouse) => {
         app.ui.toolbox.down(mouse)
      },
      onUp: (mouse) => {
         app.ui.toolbox.up(mouse)
      },
      onStroke: (mouse) => {
         app.ui.toolbox.stroke(mouse)
      },
      onMove: (mouse) => {
         app.ui.toolbox.move(mouse)
         app.ui.statusbar.updateStatus({
            pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
         })
      }
   })

   app.ui.easel = new Easel({
      canvas: app.ui.canvas,
      cursor: app.ui.cursor,
      onScale: (scale) => {
         app.ui.cursor.updateScale(scale)
         app.ui.canvas.updateScale(scale)
         app.ui.statusbar.updateStatus({
            scale: `[ scale: ${scale}x ]`
         })
      }
   })

   app.ui.pallet = new Pallet({
      mixer: app.ui.colorMixer,
      onChangeColor: (color) => {
         var colorString = app.image.hslaToString(color)
         app.ui.statusbar.updateStatus({ color: `[ color: ${colorString} ]` })
         app.ui.cursor.update({ color: colorString })
         app.ui.toolbox.selectTool('draw')
      },
      onChangeSize: (size) => {
         app.ui.cursor.update({ size })
      }
   })

   app.ui.layout.appendUI(app.ui.dialogNew.bakedHTML, 'easel')
   app.ui.layout.appendUI(app.ui.menu.bakedHTML, 'menu')
   app.ui.layout.appendUI(app.ui.appbar.bakedHTML, 'appbar')
   app.ui.layout.appendUI(app.ui.statusbar.bakedHTML, 'statusbar')
   app.ui.layout.appendUI(app.ui.toolbox.bakedHTML, 'toolbox')
   app.ui.layout.appendUI(app.ui.pallet.bakedHTML, 'pallet')
   app.ui.layout.appendUI(app.ui.easel.bakedHTML, 'easel')

   // append to body
   var elementLayout = app.ui.layout.bakedHTML.ele('layout')
   document.body.appendChild(elementLayout)
}
