// include everything
var app = {}

app.clone = function(object) {
   return JSON.parse(JSON.stringify(object))
}

app.imports = {
   js: [
      // globals
      './src/app/global.js',
      // config
      './src/config/keybinds.js',
      './src/config/menu.js',
      // ui
      './src/ui/Base.js',
      './src/ui/Components/Appbar/Appbar.js',
      './src/ui/Components/ColorMixer/ColorMixer.js',
      './src/ui/Components/Dialog/Dialog.js',
      './src/ui/Components/Easel/Easel.js',
      './src/ui/Components/Canvas/Canvas.js',
      './src/ui/Components/Cursor/Cursor.js',
      './src/ui/Components/Layout/Layout.js',
      './src/ui/Components/Menu/Menu.js',
      './src/ui/Components/Pallet/Pallet.js',
      './src/ui/Components/Statusbar/Statusbar.js',
      './src/ui/Components/Toolbox/Toolbox.js',
      // app
      './src/app/magic.js',
      './src/app/clipboard.js',
      './src/app/command.js',
      './src/app/initializeUI.js',
      './src/app/history.js',
      './src/app/html.js',
      './src/app/image.js',
      './src/app/keyboard.js',
      './src/app/onLoad.js',
      // tools
      './src/app/Tools/Draw.js',
      './src/app/Tools/Eraser.js',
      './src/app/Tools/Line.js',
      './src/app/Tools/Read.js',
      './src/app/Tools/Rectangle.js',
      './src/app/Tools/Select.js',
      // dialogs
      './src/app/Dialogs/New.js',
      './src/app/Dialogs/Open.js'
   ],
   css: [
      './src/ui/Components/Appbar/Appbar.css',
      './src/ui/Components/ColorMixer/ColorMixer.css',
      './src/ui/Components/Dialog/Dialog.css',
      './src/ui/Components/Easel/Easel.css',
      './src/ui/Components/Canvas/Canvas.css',
      './src/ui/Components/Cursor/Cursor.css',
      './src/ui/Components/Layout/Layout.css',
      './src/ui/Components/Menu/Menu.css',
      './src/ui/Components/Pallet/Pallet.css',
      './src/ui/Components/Statusbar/Statusbar.css',
      './src/ui/Components/Toolbox/Toolbox.css',
      './src/ui/Components/Toolbox/ToolboxIcons.css'
   ]
}

// here we go again
app.importing = []
app.importStartTime = Date.now()

app.load = function(){
   console.groupCollapsed('importing...')
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
      setTimeout(app.loadNext, 1) // trying to figure out github issue
   }
}

app.isLoaded = function() {
   console.groupEnd()
   console.log('importing complete: ' + (Date.now() - app.importStartTime) + 'ms')
   app.onLoad()
}

app.load()
