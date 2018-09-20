// include everything
var app = {}

app.imports = {
   js: [
      // components
      './src/components/Appbar/Appbar.js',
      './src/components/Canvas/Canvas.js',
      './src/components/ColorMixer/ColorMixer.js',
      './src/components/Cursor/Cursor.js',
      './src/components/Easel/Easel.js',
      './src/components/Pallet/Pallet.js',
      './src/components/Statusbar/Statusbar.js',
      './src/components/Toolbox/Toolbox.js',
      // app
      './src/app/keybinds.js',
      './src/app/utility.js',
      './src/app/clipboard.js',
      './src/app/global.js',
      './src/app/html.js',
      './src/app/command.js',
      './src/app/onLoad.js',
      './src/app/script.js',
      './src/app/history.js',
      './src/app/bakeHTML.js',
      // tools
      './src/app/Tools/Draw.js',
      './src/app/Tools/Eraser.js',
      './src/app/Tools/Select.js',
   ],
   css: [
      './src/shared/icons.css',
      './src/shared/layout.css',
      './src/components/Appbar/Appbar.css',
      './src/components/Canvas/Canvas.css',
      './src/components/ColorMixer/ColorMixer.css',
      './src/components/Cursor/Cursor.css',
      './src/components/Easel/Easel.css',
      './src/components/Pallet/Pallet.css',
      './src/components/Statusbar/Statusbar.css',
      './src/components/Toolbox/Toolbox.css'
   ]
}

// here we go again
app.load = function(){
   for(var fileType in app.imports) {
      for(var file of app.imports[fileType]) {
         var breakCache = "?v="+Math.random()

         var element = {
            css: { tag: 'link', attr: { href: file+breakCache, rel: 'stylesheet' } },
            js: { tag: 'script', attr: { src: file+breakCache } },
         }[fileType]

         var htmlImport = document.createElement(element.tag)
         for(var attr in element.attr)
            htmlImport.setAttribute(attr, element.attr[attr])

         document.head.appendChild(htmlImport)
      }
   }

   setTimeout(app.isLoaded, 1)
}

app.isLoaded = function() {
   if(document.readyState == 'complete') {
      return app.onLoad()
   }

   setTimeout(app.isLoaded, 100)
}

app.load()
