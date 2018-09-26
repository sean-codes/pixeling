class Toolbox {
   constructor(options) {
      this.tools = options.tools
      this.currentTool = this.tools.find((tool) => tool.name == options.initialTool)
      console.log(this.tools)
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
      var bakedHTML = app.bakeHTML([
         {
            children: this.tools.map((tool) => ({
               classes: ['tool'].concat(tool.active ? ['active'] : []),
               data: { name: tool.name },
               innerHTML: `<div class="icon ${tool.icon}"></div>`,
               events: {
                  click: this.toolClicked.bind(this)
               }
            }))
         }
      ])


      this.html = bakedHTML.first()
      for(var toolID = 0; toolID < this.html.children.length; toolID++) {
         this.tools[toolID].element = this.html.children[toolID]   
      }
   }
}
