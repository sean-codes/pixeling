class Statusbar {
  constructor(html, options) {
    this.html = html
    this.setStatus(options.status)
    this.render()
  }

  setStatus(status) {
    this.status = JSON.parse(JSON.stringify(status))
  }

  render() {
    var batchCookingRecipe = this.status.map((status) => {
      return {
        classes: ['status'],
        innerHTML: status.innerHTML
      }
    })

    var bakedHTML = app.script.bakeHTML(batchCookingRecipe)
    bakedHTML.appendTo(this.html)
  }
}
