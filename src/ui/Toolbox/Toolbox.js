class Toolbox {
   constructor(options) {
      this.tools = options.tools
      this.currentTool = this.tools.find((tool) => tool.name == options.initialTool)
      this.createHTML()
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
         var toolElement = this.bakedHTML.ele('tool_'+tool.name)
         toolElement.classList.toggle('active', tool.active)

         if(tool.active) {
            this.currentTool = tool
            this.currentTool.overrides.select
               && this.currentTool.overrides.select()
         }
      }
   }

   createHTML() {
      this.bakedHTML = app.bakeHTML({
         classes: ['toolbox'],
         ingredients: this.tools.map((tool) => ({
            name: 'tool_'+tool.name,
            data: { name: tool.name },
            classes: ['tool'],
            ingredients: [{ classes: ['icon', tool.icon] }],
            events: {
               click: this.toolClicked.bind(this)
            }
         }))
      })
   }
}
