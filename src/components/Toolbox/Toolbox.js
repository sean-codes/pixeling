class Toolbox {
   constructor(html) {
      this.html = html

      this.tools = [{
         icon: 'draw',
         tool: new ToolPencil()
      }]

      this.currentTool = this.tools[0].tool

      this.render()
   }

   down(mouse) {
      this.currentTool.down(mouse)
   }

   move(mouse) {
      this.currentTool.move(mouse)
   }

   stroke(mouse) {
      this.currentTool.stroke(mouse)
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
