class Pallet {
  constructor(html, options) {
    this.html = html
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

  render() {
    console.log('cats', this.html)
    var htmlRecipe = this.colors.map((color) => {
      return {
        classes: ['color'],
        styles: { background: color }
      }
    })

    app.script.bakeHTML(htmlRecipe).appendTo(this.html)
  }
}
