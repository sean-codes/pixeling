var app = {}

// some handys :]
app.bakeHTML = BakeHTML
app.utility = new Utility()

// global html
app.html = {
   appbar: document.querySelector('.appbar'),
   pallet: document.querySelector('.pallet'),
   easel: document.querySelector('.easel'),
   toolbox: document.querySelector('.toolbox'),
   statusbar: document.querySelector('.statusbar')
}

app.global = {
   color: undefined
}

app.image = {
   width: 48,
   height: 32,
   pixels: {}
}

app.script = {
   init: function() {
      app.component.toolbox.selectTool('draw')
      app.global.color = app.component.pallet.getColor()
      //app.component.pallet.setPallet(['#FFF', '#DDD', '#CCC'])
      //app.component.pallet.setColor('#FFF')
      //app.component.pallet.showMixer()
   },
   setColor: function(color) {
      app.global.color = color
      app.global.colorString = app.utility.hslaToString(color)
      app.component.statusbar.updateStatus({
         color: `[ color: ${app.global.colorString} ]`
      })

      app.component.toolbox.colorChange()
   },
   usePalletColor: function() {
      app.global.color = app.component.pallet.color
   },
   erasePixelAtPosition: function(position) {
      var pixelID = position.x + 'x' + position.y
      var pixel = app.image.pixels[pixelID]

      if(pixel) pixel.color = { h: 0, s: 0, l: 0, a: 0 }
      app.component.canvas.updateImage(app.image)
   },
   updatePixel: function(position) {
      var color = app.component.pallet.getColor()
      var pixelID = position.x + 'x' + position.y
      var pixel = app.image.pixels[pixelID]

      if(pixel) {
         pixel.color = app.utility.addHSLColor(pixel.color, color)
      } else {
         pixel = { position, color }
         app.image.pixels[pixelID] = pixel
      }
      pixel.colorString = app.utility.hslaToString(pixel.color)
      app.component.canvas.updateImage(app.image)
   },
   setCursor: function(options) {
      app.component.cursor.update(options)
   }
}

app.component = {}
app.component.appbar = new Appbar(app.html.appbar)
app.component.statusbar = new Statusbar(app.html.statusbar, {
   status: {
      color: '[ hsla() ]',
      pos: '[ pos: 0, 0 ]',
      scale: '[ scale: 1x ]',
   }
})

app.component.toolbox = new Toolbox(app.html.toolbox)

app.component.cursor = new Cursor()
app.component.canvas = new Canvas({
   image: app.image,
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

app.component.easel = new Easel(app.html.easel, {
   canvas: app.component.canvas,
   cursor: app.component.cursor,
   onScale: (scale) => {
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


app.script.init()
