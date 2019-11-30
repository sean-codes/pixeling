// include everything
var app = {}
app.tools = {}
app.dialogs = {}
app.config = {}
app.rgba = { r: 0, g: 0, b: 0, a: 1 }
app.cursorSize = 1
app.switchedToEraserFrom = undefined

// for splitting key/value pairs
app.clone = function(object) {
   return JSON.parse(JSON.stringify(object))
}

// for operating
app.scratchCanvas = document.createElement('canvas')
app.scratchCtx = app.scratchCanvas.getContext('2d')

app.imports = {
   js: [
      // globals
      { path: './src/app/util.js' },
      // config
      { path: './src/app/Config/keybinds.js' },
      { path: './src/app/Config/menu.js' },
      // ui
      { path: './src/ui/Base.js', loadBeforeNext: true },
      { path: './src/ui/Appbar/Appbar.js' },
      { path: './src/ui/ColorMixer/ColorMixer.js' },
      { path: './src/ui/ContextMenu/ContextMenu.js' },
      { path: './src/ui/Dialog/Dialog.js' },
      { path: './src/ui/Easel/Easel.js' },
      { path: './src/ui/Canvas/Canvas.js' },
      { path: './src/ui/Cursor/Cursor.js' },
      { path: './src/ui/Frames/Frames.js' },
      { path: './src/ui/Filedrop/Filedrop.js' },
      { path: './src/ui/Layout/Layout.js' },
      { path: './src/ui/Menu/Menu.js' },
      { path: './src/ui/Pallet/Pallet.js' },
      { path: './src/ui/Preview/Preview.js' },
      { path: './src/ui/Statusbar/Statusbar.js' },
      { path: './src/ui/Toolbox/Toolbox.js' },
      // app
      { path: './src/app/clipboard.js' },
      { path: './src/app/command.js' },
      { path: './src/app/initializeUI.js' },
      { path: './src/app/history.js' },
      { path: './src/app/frames.js' },
      { path: './src/app/fullscreen.js' },
      { path: './src/app/keyboard.js' },
      { path: './src/app/onLoad.js' },
      { path: './src/app/open.js' },
      { path: './src/app/updateFrame.js' },
      // tools
      { path: './src/app/Tools/Base.js', loadBeforeNext: true },
      { path: './src/app/Tools/Draw.js' },
      { path: './src/app/Tools/Eraser.js' },
      { path: './src/app/Tools/Fill.js' },
      { path: './src/app/Tools/Line.js' },
      { path: './src/app/Tools/Read.js' },
      { path: './src/app/Tools/Rectangle.js' },
      { path: './src/app/Tools/Select.js' },
      // dialogs
      { path: './src/app/Dialogs/New.js' },
      { path: './src/app/Dialogs/MakeFrames.js' },
      { path: './src/app/Dialogs/Canvas.js' },
      { path: './src/app/Dialogs/OnionFrames.js' },
   ],
   css: [
      { path: './src/ui/Appbar/Appbar.css' },
      { path: './src/ui/Dialog/Dialog.css' },
      { path: './src/ui/Easel/Easel.css' },
      { path: './src/ui/Canvas/Canvas.css' },
      { path: './src/ui/ColorMixer/ColorMixer.css' },
      { path: './src/ui/ContextMenu/ContextMenu.css' },
      { path: './src/ui/Cursor/Cursor.css' },
      { path: './src/ui/Frames/Frames.css' },
      { path: './src/ui/Filedrop/Filedrop.css' },
      { path: './src/ui/Layout/Layout.css' },
      { path: './src/ui/Menu/Menu.css' },
      { path: './src/ui/Pallet/Pallet.css' },
      { path: './src/ui/Preview/Preview.css' },
      { path: './src/ui/Statusbar/Statusbar.css' },
      { path: './src/ui/Toolbox/Toolbox.css' },
      { path: './src/ui/Toolbox/ToolboxIcons.css' },
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
            css: { tag: 'link', attr: { href: file.path+breakCache, rel: 'stylesheet' }, file: file },
            js: { tag: 'script', attr: { src: file.path+breakCache }, file: file },
         }[fileType]

         app.importing.push(element)
      }
   }

   app.loadingTotal = app.importing.length
   app.loading = app.importing.length

   app.loadNext()
}

app.loadNext = function() {
   if (!app.importing.length) return
   const importing = app.importing.shift()

   // create the element
   var htmlImporting = document.createElement(importing.tag)
   for(var attr in importing.attr) htmlImporting.setAttribute(attr, importing.attr[attr])
   document.head.appendChild(htmlImporting)

   console.log(importing.attr.href ? importing.attr.href : importing.attr.src)

   // this lets us pause on files incase they need to be extended by others
   if (!importing.file.loadBeforeNext) app.loadNext()

   htmlImporting.onload = () => {
      app.loading -= 1
      var percent = 1 - (app.loading / app.loadingTotal)
      app.onLoadStatus(percent, importing)

      if (!app.loading) app.isLoaded()
      else if (importing.file.loadBeforeNext) app.loadNext()
   }
}

app.isLoaded = function() {
   console.groupEnd()
   console.log('importing complete: ' + (Date.now() - app.importStartTime) + 'ms')
   setTimeout(app.onLoad, 10)
}
