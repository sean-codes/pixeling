class Toolbox {
   constructor(html) {
      this.html = html

      this.tools = [
         {
            name: 'draw',
            icon: 'draw',
            tool: new ToolPencil(),
            active: true
         },
         {
            name: 'eraser',
            icon: 'eraser',
            tool: new ToolEraser()
         }
   ]

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

   toolClicked(e, element) {
      var toolName = element.dataset.name
      for(var tool of this.tools) {
         tool.active = tool.name == toolName ? true : false
         tool.element.classList.toggle('active', tool.active)

         if(tool.active) {
            this.currentTool = tool.tool
            this.currentTool.select && this.currentTool.select()
         }
      }
   }

   render() {
      var htmlRecipe = []
      for(let tool of this.tools) {
         htmlRecipe.push({
            classes: ['tool'].concat(tool.active ? ['active'] : []),
            data: { name: tool.name },
            innerHTML: `<div class="icon ${tool.icon}"></div>`,
            events: {
               click: this.toolClicked.bind(this)
            }
         })
      }

      var htmlTools = app.script.bakeHTML(htmlRecipe)
      for(var toolID in htmlTools.elements) {
         this.tools[toolID].element = htmlTools.elements[toolID]
      }

      htmlTools.appendTo(this.html)
   }
}
