class Pallet {
   constructor(html, options) {
      this.html = {
         container: html
      }
      this.mixer = options.mixer
      this.onChange = options.onChange

      this.color = '#000'
      this.colors = [
         'hsla(0, 0%, 100%, 1)',
         'hsla(0, 0%, 90%, 1)',
         'hsla(0, 0%, 80%, 1)',
         'hsla(0, 0%, 70%, 1)',
         'hsla(0, 0%, 60%, 1)',
         'hsla(0, 0%, 50%, 1)',
         'hsla(0, 0%, 40%, 1)',
         'hsla(0, 0%, 30%, 1)',
         'hsla(0, 0%, 20%, 1)',
         'hsla(0, 0%, 10%, 1)',
         'hsla(0, 0%, 0%, 1)',
      ]

      this.render()
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

      this.setColor(element.dataset.color)
   }

   setColor(color) {
      this.color = color
      this.html.color.style.background = this.color
      this.html.active.style.background = this.color
      this.html.active.dataset.color = this.color
      this.onChange(this.color)
   }

   render() {
      var htmlColorsRecipe = [
         {
            classes: ['colors'],
            children: this.colors.map((color) => {
               return {
                  classes: ['color'],
                  data: { color: color },
                  styles: {
                     background: color
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
