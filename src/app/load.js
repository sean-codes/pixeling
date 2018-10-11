// include everything
var app = {}

app.clone = function(object) {
   return JSON.parse(JSON.stringify(object))
}

app.imports = {
   js: [
      // globals
      './src/app/globals.js',
      // config
      './src/app/Config/keybinds.js',
      './src/app/Config/menu.js',
      // ui
      './src/ui/Base.js',
      './src/ui/Appbar/Appbar.js',
      './src/ui/ColorMixer/ColorMixer.js',
      './src/ui/Dialog/Dialog.js',
      './src/ui/Easel/Easel.js',
      './src/ui/Canvas/Canvas.js',
      './src/ui/Cursor/Cursor.js',
      './src/ui/Frames/Frames.js',
      './src/ui/Layout/Layout.js',
      './src/ui/Menu/Menu.js',
      './src/ui/Pallet/Pallet.js',
      './src/ui/Preview/Preview.js',
      './src/ui/Statusbar/Statusbar.js',
      './src/ui/Toolbox/Toolbox.js',
      // app
      './src/app/clipboard.js',
      './src/app/command.js',
      './src/app/initializeUI.js',
      './src/app/history.js',
      './src/app/frames.js',
      './src/app/keyboard.js',
      './src/app/onLoad.js',
      './src/app/updateFrame.js',
      // tools
      './src/app/Tools/Base.js',
      './src/app/Tools/Draw.js',
      './src/app/Tools/Eraser.js',
      './src/app/Tools/Fill.js',
      './src/app/Tools/Line.js',
      './src/app/Tools/Read.js',
      './src/app/Tools/Rectangle.js',
      './src/app/Tools/Select.js',
      // dialogs
      './src/app/Dialogs/New.js',
      './src/app/Dialogs/Open.js',
      './src/app/Dialogs/Canvas.js',
      './src/app/Dialogs/OnionFrames.js'
   ],
   css: [
      './src/ui/Appbar/Appbar.css',
      './src/ui/ColorMixer/ColorMixer.css',
      './src/ui/Dialog/Dialog.css',
      './src/ui/Easel/Easel.css',
      './src/ui/Canvas/Canvas.css',
      './src/ui/Cursor/Cursor.css',
      './src/ui/Frames/Frames.css',
      './src/ui/Layout/Layout.css',
      './src/ui/Menu/Menu.css',
      './src/ui/Pallet/Pallet.css',
      './src/ui/Preview/Preview.css',
      './src/ui/Statusbar/Statusbar.css',
      './src/ui/Toolbox/Toolbox.css',
      './src/ui/Toolbox/ToolboxIcons.css'
   ]
}

// here we go again
app.importing = []
app.importStartTime = Date.now()

app.load = function(options){
   console.groupCollapsed('importing...')
   app.onLoadStatus = options.onLoadStatus
   for(var fileType in app.imports) {
      for(var file of app.imports[fileType]) {
         var breakCache = "?v="+Math.round(Math.random()*1000000000000000000)

         var element = {
            css: { tag: 'link', attr: { href: file+breakCache, rel: 'stylesheet' } },
            js: { tag: 'script', attr: { src: file+breakCache } },
         }[fileType]

         app.importing.push({ ...element })
      }
   }
   app.importingLength = app.importing.length

   app.loadNext()
}

app.loadNext = function() {
   if(!app.importing.length) return app.isLoaded()

   var importing = app.importing.shift()
   console.log(importing.attr.href ? importing.attr.href : importing.attr.src)

   var htmlImporting = document.createElement(importing.tag)
   for(var attr in importing.attr) htmlImporting.setAttribute(attr, importing.attr[attr])

   document.head.appendChild(htmlImporting)

   htmlImporting.onload = () => {
      var percent = (app.importingLength - app.importing.length) / app.importingLength
      app.onLoadStatus(percent, importing)
      setTimeout(app.loadNext, 1) // trying to figure out github issue
   }
}

app.isLoaded = function() {
   console.groupEnd()
   console.log('importing complete: ' + (Date.now() - app.importStartTime) + 'ms')
   app.onLoad()
}
