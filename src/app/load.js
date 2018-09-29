// include everything
var app = {}

app.imports = {
   js: [
      // ui
      './src/ui/Base.js',
      './src/ui/Components/Appbar/Appbar.js',
      './src/ui/Components/Canvas/Canvas.js',
      './src/ui/Components/ColorMixer/ColorMixer.js',
      './src/ui/Components/Cursor/Cursor.js',
      './src/ui/Components/Easel/Easel.js',
      './src/ui/Components/Layout/Layout.js',
      './src/ui/Components/Pallet/Pallet.js',
      './src/ui/Components/Statusbar/Statusbar.js',
      './src/ui/Components/Toolbox/Toolbox.js',
      // app
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
      './src/ui/Components/Appbar/Appbar.css',
      './src/ui/Components/Canvas/Canvas.css',
      './src/ui/Components/ColorMixer/ColorMixer.css',
      './src/ui/Components/Cursor/Cursor.css',
      './src/ui/Components/Easel/Easel.css',
      './src/ui/Components/Layout/Layout.css',
      './src/ui/Components/Pallet/Pallet.css',
      './src/ui/Components/Statusbar/Statusbar.css',
      './src/ui/Components/Toolbox/Toolbox.css',
      './src/ui/Components/Toolbox/ToolboxIcons.css'
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
