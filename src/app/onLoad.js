app.onLoad = function() {
   // image
   app.image = {
      width: 48,
      height: 32,
      pixels: {}
   }

   // set components
   app.component = {}
   app.component.appbar = new Appbar(app.html.appbar)
   app.component.statusbar = new Statusbar(app.html.statusbar, {
      status: {
         color: '[ hsla() ]',
         pos: '[ pos: 0, 0 ]',
         scale: '[ scale: 1x ]',
      }
   })

   app.component.toolbox = new Toolbox(app.html.toolbox, {
      tools: [
         { name: 'draw', icon: 'draw', overrides : app.tools.draw },
         { name: 'eraser', icon: 'eraser', overrides : app.tools.eraser  },
         { name: 'select', icon: 'select', overrides : app.tools.select  }
      ]
   })

   app.component.cursor = new Cursor({
      onDown: (mouse) => {
         app.component.toolbox.down(mouse)
      },
      onUp: (mouse) => {
         app.component.toolbox.up(mouse)
      },
      onStroke: (mouse) => {
         app.component.toolbox.stroke(mouse)
      },
      onMove: (mouse) => {
         app.component.toolbox.move(mouse)
         app.component.statusbar.updateStatus({
            pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
         })
      }
   })
   app.component.canvas = new Canvas({
      image: app.image,
   })

   app.component.easel = new Easel(app.html.easel, {
      canvas: app.component.canvas,
      cursor: app.component.cursor,
      onScale: (scale) => {
         app.component.cursor.updateScale(scale)
         app.component.canvas.updateScale(scale)
         app.component.statusbar.updateStatus({
            scale: `[ scale: ${scale}x ]`
         })
      }
   })

   app.component.colorMixer = new ColorMixer()
   app.component.pallet = new Pallet(app.html.pallet, {
      mixer: app.component.colorMixer,
      onChange: app.script.setColor,
   })


   app.component.toolbox.selectTool('draw')
   app.global.color = app.component.pallet.getColor()
   document.body.addEventListener('keydown', app.script.parseKeyEvent)
}
