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
   }
}
