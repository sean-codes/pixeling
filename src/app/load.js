// include everything
var app = {}

app.imports = {
   js: [
      // ui
      './src/ui/Appbar/Appbar.js',
      './src/ui/Canvas/Canvas.js',
      './src/ui/ColorMixer/ColorMixer.js',
      './src/ui/Cursor/Cursor.js',
      './src/ui/Easel/Easel.js',
      './src/ui/Layout/Layout.js',
      './src/ui/Pallet/Pallet.js',
      './src/ui/Statusbar/Statusbar.js',
      './src/ui/Toolbox/Toolbox.js',
      // app
      './src/app/bakeHTML.js',
      './src/app/clipboard.js',
      './src/app/command.js',
      './src/app/ui.js',
      './src/app/global.js',
      './src/app/history.js',
      './src/app/html.js',
      './src/app/image.js',
      './src/app/keyboard.js',
      './src/app/onLoad.js',
      './src/app/utility.js',
      // tools
      './src/app/Tools/Draw.js',
      './src/app/Tools/Eraser.js',
      './src/app/Tools/Select.js',
      './src/app/Tools/Read.js',
   ],
   css: [
      './src/shared/icons.css',
      './src/ui/Appbar/Appbar.css',
      './src/ui/Canvas/Canvas.css',
      './src/ui/ColorMixer/ColorMixer.css',
      './src/ui/Cursor/Cursor.css',
      './src/ui/Easel/Easel.css',
      './src/ui/Layout/Layout.css',
      './src/ui/Pallet/Pallet.css',
      './src/ui/Statusbar/Statusbar.css',
      './src/ui/Toolbox/Toolbox.css'
   ]
}

// here we go again
app.loading = 0
app.load = function(){
   for(var fileType in app.imports) {
      for(var file of app.imports[fileType]) {
         app.loading += 1
         var breakCache = "?v="+Math.random()

         var element = {
            css: { tag: 'link', attr: { href: file+breakCache, rel: 'stylesheet' } },
            js: { tag: 'script', attr: { src: file+breakCache } },
         }[fileType]

         var htmlImport = document.createElement(element.tag)
         for(var attr in element.attr)
            htmlImport.setAttribute(attr, element.attr[attr])

         document.head.appendChild(htmlImport)
         htmlImport.onload = () => {
            app.loading -= 1
         }
      }
   }

   setTimeout(app.isLoaded, 1)
}

app.isLoaded = function() {
   if(!app.loading) {
      return app.onLoad()
   }

   setTimeout(app.isLoaded, 100)
}

app.load()
