class Pallet {
   constructor(html, options) {
      this.html = {
         container: html
      }

      this.mixer = options.mixer
      this.onChange = options.onChange

      this.colors = [
         { h: 0, s: 0, l: 100, a: 1 },
         { h: 0, s: 0, l: 90, a: 1 },
         { h: 0, s: 0, l: 80, a: 1 },
         { h: 0, s: 0, l: 70, a: 1 },
         { h: 0, s: 0, l: 60, a: 1 },
         { h: 0, s: 0, l: 50, a: 1 },
         { h: 0, s: 0, l: 40, a: 1 },
         { h: 0, s: 0, l: 30, a: 1 },
         { h: 0, s: 0, l: 20, a: 1 },
         { h: 0, s: 0, l: 10, a: 1 },
         { h: 0, s: 0, l:  0, a: 1 }
      ]
      this.selected = 0

      this.htmlCreate()
   }

   eventClickColor(e, element) {
      this.setActiveColorElement(element)
   }

   setActiveColorElement(element) {
      for(var colorElement of this.html.colors) {
         colorElement.classList.remove('active')
      }

      element.classList.add('active')
      this.html.active = element
      this.selected = element.dataset.colorID
      this.setColor(this.colors[element.dataset.colorID])
   }

   setColor(color) {
      this.colors[this.selected] = color
      var stringColor = this.colorObjectToString(color)

      this.html.color.style.background = stringColor
      this.html.active.style.background = stringColor
      this.html.active.dataset.color = stringColor
      this.mixer.setColor(color)
      this.onChange(stringColor)
   }

   colorObjectToString(color) {
      return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`
   }

   htmlCreate() {
      var htmlColorsRecipe = [
         {
            classes: ['colors'],
            children: this.colors.map((color, id) => {
               return {
                  classes: ['color'],
                  data: { colorID: id },
                  styles: {
                     background: this.colorObjectToString(this.colors[id])
                  },
                  events: {
                     click: this.eventClickColor.bind(this)
                  }
               }
            })
         },
         {
            tag: 'div',
            classes: ['mixer'],
            styles: {
               background: this.color
            },
            append: [ this.mixer.html.chooser ]
         }
      ]

      var bakedHTML = app.script.bakeHTML(htmlColorsRecipe)

      this.html.colors = bakedHTML.elements[0].children
      this.html.color = bakedHTML.elements[1]

      this.setActiveColorElement(this.html.colors[0])

      // link up mixer
      this.mixer.setLabel(this.html.color)
      this.mixer.onChange = (color) => {
         this.setColor(color)
      }

      bakedHTML.appendTo(this.html.container)
   }
}
