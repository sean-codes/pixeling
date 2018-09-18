app.utility = {
   // addHSLColorv1: function(color, targetColor) {
   //    var percent = targetColor.a
   //    var h = Math.ceil(color.h + (targetColor.h - color.h) * percent)
   //    var s = Math.ceil(color.s + (targetColor.s - color.s) * percent)
   //    var l = Math.ceil(color.l + (targetColor.l - color.l) * percent)
   //    var a = Math.min(1, color.a + targetColor.a)
   //
   //    return { h, s, l, a }
   // },

   addHSLColor: function(original, target) {
         var percent = target.a

         // saturation = amout of hue to use. ( im making this up :] )
         var totalSaturation = target.s + original.s
         var targetSaturationPercent = target.s / totalSaturation
         var hueDifference = target.h - original.h

         // only add the saturation amount of target to color
         // if you had a color with 0 saturation the original hue would stay!
         var h = original.h + hueDifference * targetSaturationPercent
         var s = Math.ceil(original.s + (target.s - original.s) * percent)
         var l = Math.ceil(original.l + (target.l - original.l) * percent)
         var a = Math.min(1, original.a + target.a)

         return { h, s, l, a }
   },

   hslaToString: function(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   },

   moveArea: function(area, move) {
      // i need to loop these in the right direction
      app.utility.loopPixels(area, app.image.pixels, (pixelID, pixel) => {
         pixel.position.x += move.x
         pixel.position.y += move.y

         var newID = app.utility.pixelID(pixel.position.x, pixel.position.y)
         app.image.pixels[newID] = JSON.parse(JSON.stringify(pixel))
         delete app.image.pixels[pixelID]
      }, move)

      app.component.canvas.updateImage(app.image)
      app.component.cursor.update({
         selected: {
            x: app.component.cursor.selected.x + move.x,
            y: app.component.cursor.selected.y + move.y,
            width: app.component.cursor.selected.width,
            height: app.component.cursor.selected.height
         }
      })
   },

   copyArea: function(area) {
      var copy = {
         dimensions: {
            x: 0,
            y: 0,
            width: area.width,
            height: area.height
         },
         pixels: {}
      }

      app.utility.loopPixels(area, app.image.pixels, (pixelID, pixel) => {
         pixel.position.x -= area.x
         pixel.position.y -= area.y
         var newID = app.utility.pixelID(pixel.position.x, pixel.position.y)
         copy.pixels[newID] = pixel
      })

      return copy
   },

   loopPixels: function(area, pixels, run, direction) {
      var direction = {
         x: direction ? direction.x || 1 : 1,
         y: direction ? direction.y || 1 : 1
      }

      var dirX = Math.sign(direction.x)
      var dirY = Math.sign(direction.y)
      var startX = dirX < 0 ? area.x : area.x + area.width-1
      var startY = dirY < 0 ? area.y : area.y + area.height-1
      var endX = dirX < 0 ? area.x + area.width : area.x
      var endY = dirY < 0 ? area.y + area.height : area.y

      for(var x = startX; (dirX < 0 ? x < endX : x >= endX); x -= dirX) {
         for(var y = startY; (dirY < 0 ? y < endY : y >= endY); y -= dirY) {
            var pixelID = app.utility.pixelID(x, y)

            if(pixels[pixelID]) {
               var pixel = JSON.parse(JSON.stringify(pixels[pixelID]))
               run(pixelID, pixel)
            }
         }
      }
   },

   pixelID(x, y) {
      return x + 'x' + y
   }
}
