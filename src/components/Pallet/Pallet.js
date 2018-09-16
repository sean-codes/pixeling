class Pallet {
   constructor(html, options) {
      this.html = html
      this.onChange = options.onChange
      
      this.color = '#000'
      this.colors = [
         '#FFF',
         '#DDD',
         '#CCC',
         '#BBB',
         '#AAA',
         '#999',
         '#888',
         '#777',
         '#666',
         '#555',
         '#333',
         '#222',
         '#111',
         '#000',
      ]

      this.render()
   }

   changeColor(e, element) {
      this.color = element.dataset.color
      for(var element of this.bakedHTML.elements) {
         var isSelected = element.dataset.color == this.color
         element.classList.toggle('active', isSelected)
      }

      this.onChange(this.color)
   }

   render() {
      var htmlRecipe = this.colors.map((color) => {
         return {
            classes: ['color'].concat(color == this.color ? ['active'] : []),
            data: { color: color },
            styles: {
               background: color
            },
            events: {
               click: this.changeColor.bind(this)
            }
         }
      })

      this.bakedHTML = app.script.bakeHTML(htmlRecipe)
      this.bakedHTML.appendTo(this.html)
   }
}
