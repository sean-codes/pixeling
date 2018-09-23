class Toolbox {
   constructor(html, options) {
      this.html = html
      this.tools = options.tools
      this.currentTool = this.tools.find((tool) => tool.name == options.initialTool)
      console.log(this.currentTool)
      this.render()
   }

   down(mouse) {
      this.currentTool.overrides.down
         && this.currentTool.overrides.down(mouse)
   }

   up(mouse) {
      this.currentTool.overrides.up
         && this.currentTool.overrides.up(mouse)
   }

   move(mouse) {
      this.currentTool.overrides.move
         && this.currentTool.overrides.move(mouse)
   }

   stroke(mouse) {
      this.currentTool.overrides.stroke
         && this.currentTool.overrides.stroke(mouse)
   }

   colorChange(mouse) {
      this.currentTool.overrides.colorChange
         && this.currentTool.overrides.colorChange(mouse)
   }

   toolClicked(e, element) {
      var toolName = element.dataset.name
      this.selectTool(toolName)
   }

   selectTool(toolName) {
      this.currentTool.overrides.unSelect
         && this.currentTool.overrides.unSelect()

      for(var tool of this.tools) {
         tool.active = tool.name == toolName ? true : false
         tool.element.classList.toggle('active', tool.active)

         if(tool.active) {
            this.currentTool = tool
            this.currentTool.overrides.select
               && this.currentTool.overrides.select()
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

      var htmlTools = app.bakeHTML(htmlRecipe)
      for(var toolID in htmlTools.elements) {
         this.tools[toolID].element = htmlTools.elements[toolID]
      }

      htmlTools.appendTo(this.html)
   }
}
