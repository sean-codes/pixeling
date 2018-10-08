// going to use this to try and funnel these calls
app.updateFrame = function() {
   var frameID = app.frames.currentFrame
   var frame = app.frames.getCurrentFrame()

   app.ui.canvas.updateImage(frame)
   app.ui.cursor.updateImage(frame)
   app.ui.frames.updateFrame(frameID, frame)
}
