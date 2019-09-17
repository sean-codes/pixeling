// going to use this to try and funnel these calls
app.updateFrames = function() {
   var frameID = app.frames.currentFrame
   var frames = app.frames.list
   var frame = app.frames.getCurrentFrame()

   app.ui.canvas.setFrames(app.frames, app.ui.cursor.selected)
   app.ui.frames.setFrames(app.frames, app.ui.cursor.selected)
   app.ui.preview.setFrames(app.frames, app.ui.cursor.selected)
   app.ui.preview.setVisibleFrame(frameID)
   app.ui.cursor.updateFrames(app.frames)
   app.ui.easel.updateFrames(app.frames)
}

app.updateTemporary = function() {
   app.ui.canvas.drawTemporary(app.frames.temporaryCanvas)
}
