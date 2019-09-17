// going to use this to try and funnel these calls
app.updateFrames = function() {
   var frameID = app.frames.currentFrame
   var frames = app.frames.list
   var frame = app.frames.getCurrentFrame()

   app.ui.canvas.setFrames(frameID, frames)
   app.ui.canvas.setSelected(app.ui.cursor.selected)
   app.ui.cursor.updateImage(frame)
   app.ui.preview.setFrames(frames, frameID, app.ui.cursor.selected)
   app.ui.preview.setVisibleFrame(frameID)
   app.ui.frames.setFrames(frames, frameID, app.ui.cursor.selected)
}

app.updateTemporary = function() {
   app.ui.canvas.drawTemporary(app.frames.temporaryCanvas)
}
