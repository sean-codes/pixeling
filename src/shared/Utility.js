class Utility {
   addHSLColor(color, targetColor) {
      var percent = targetColor.a
      var h = Math.ceil(color.h + (targetColor.h - color.h) * percent)
      var s = Math.ceil(color.s + (targetColor.s - color.s) * percent)
      var l = Math.ceil(color.l + (targetColor.l - color.l) * percent)
      var a = Math.min(1, color.a + targetColor.a)

      return { h, s, l, a }
   }

   hslaToString(hsla) {
      return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
   }
}
