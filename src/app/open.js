app.open = {
   eleInput: undefined,

   init: function() {
      // first file
      this.eleInput = document.createElement('input')
      this.eleInput.setAttribute('type', 'file')
      this.eleInput.setAttribute('accept', 'image/*')
      this.eleInput.style.display = 'none'
      document.body.appendChild(this.eleInput)

      this.eleInput.addEventListener('change', this.file.bind(this))
   },

   request: function() {
      this.eleInput.click()
   },

   file: function(e) {
      var file = this.eleInput.files[0]
      if(!file) return

      app.history.name = file.name
      // read file into image
      var reader = new FileReader()
      reader.onload = (e) => {
         var image = new Image()
         image.onload = () => {
            var timer = Date.now()
            app.frames.load(image, 1)
            app.history.reset()
            app.updateFrames()
            app.ui.easel.centerCanvas()
            app.ui.easel.fitCanvas()
         }
         image.src = e.target.result
      }
      reader.readAsDataURL(file)
   }
}
