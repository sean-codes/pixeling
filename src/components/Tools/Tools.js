class Tools {
  constructor(html) {
    this.html = html
    this.tools = [
      {
        icon: 'draw'
      }
    ]

    this.render()
  }

  render() {
    console.log('test')
    var htmlRecipe = this.tools.map((tool) => {
      return {
        classes: ['tool'],
        innerHTML: '<div class="icon draw"></div>'
      }
    })

    app.script.bakeHTML(htmlRecipe).appendTo(this.html)
  }
}
