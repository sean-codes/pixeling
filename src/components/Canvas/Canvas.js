class Canvas {
  constructor(html) {
    this.html = html
    this.bakeHTML()
    this.listenToScrollAndCanvas()
  }

  bakeHTML() {
    var htmlBakeRecipe = [{
      classes: ['scroll'],
      children: [ { tag: 'canvas' } ]
    }]

    var bakedHTML = app.script.bakeHTML(htmlBakeRecipe)
    this.htmlScroll = bakedHTML.elements[0]
    this.htmlCanvas = this.htmlScroll.querySelector('canvas')

    bakedHTML.appendTo(this.html)
  }

  listenToScrollAndCanvas() {
    this.htmlScroll.addEventListener('mousedown', function() {

    })
  }

  render() {

  }
}
