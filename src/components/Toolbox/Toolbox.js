class Toolbox {
   constructor(html) {
      this.html = html
      this.tools = [{
         icon: 'draw',
         tool: new ToolPencil()
      }]

      this.render()
   }

   stroke() {
      console.log('run tools stroke action')
   }

   render() {
      var htmlRecipe = this.tools.map((tool) => {
         return {
            classes: ['tool'],
            innerHTML: '<div class="icon draw"></div>'
         }
      })

      app.script.bakeHTML(htmlRecipe).appendTo(this.html)
   }
}
