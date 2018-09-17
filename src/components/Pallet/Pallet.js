class Pallet {
   constructor(html, options) {
      this.html = {
         container: html
      }

      this.mixer = options.mixer
      this.onChange = options.onChange

      this.colors = [
         { h: 0, s: 0, l: 0, a: 1 },
         { h: 0, s: 0, l: 25, a: 1 },
         { h: 0, s: 0, l: 50, a: 1 },
         { h: 0, s: 0, l: 75, a: 1 },
         { h: 0, s: 60, l: 60, a: 1 },
         { h: 25, s: 60, l: 60, a: 1 },
         { h: 50, s: 60, l: 60, a: 1 },
         { h: 75, s: 60, l: 60, a: 1 },
         { h: 100, s: 60, l: 60, a: 1 },
         { h: 125, s: 60, l: 60, a: 1 },
         { h: 150, s: 60, l: 60, a: 1 },
         { h: 175, s: 60, l: 60, a: 1 },
         { h: 200, s: 60, l: 60, a: 1 },
         { h: 225, s: 60, l: 60, a: 1 },
         { h: 250, s: 60, l: 60, a: 1 },
         { h: 275, s: 60, l: 60, a: 1 },
         { h: 300, s: 60, l: 60, a: 1 },
         { h: 325, s: 60, l: 60, a: 1 },
         { h: 350, s: 60, l: 60, a: 1 },
      ]
      this.selected = this.colors.length - 1

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
      var stringColor = app.utility.hslaToString(color)

      this.html.color.style.background = stringColor
      this.html.active.style.background = stringColor
      this.html.active.dataset.color = stringColor
      this.mixer.setColor(color)
      this.onChange(color)
   }

   getColor() {
      return JSON.parse(JSON.stringify(this.colors[this.selected]))
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
                     background: app.utility.hslaToString(this.colors[id])
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

      var bakedHTML = app.bakeHTML(htmlColorsRecipe)

      this.html.colors = bakedHTML.elements[0].children
      this.html.color = bakedHTML.elements[1]

      this.setActiveColorElement(this.html.colors[this.selected])

      // link up mixer
      this.mixer.setLabel(this.html.color)
      this.mixer.onChange = (color) => {
         this.setColor(color)
      }

      bakedHTML.appendTo(this.html.container)
   }
}
