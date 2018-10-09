// going to use this to try and funnel these calls
app.updateFrame = function() {
   var frameID = app.frames.currentFrame
   var frames = app.frames.list
   var frame = app.frames.getCurrentFrame()

   app.ui.cursor.updateImage(frame)
   app.ui.frames.setFrames(frames, frameID)
   app.ui.preview.setFrames(frames, frameID)
   app.ui.canvas.setFrames(frameID, frames)
   app.ui.preview.setVisibleFrame(frameID)
   // app.ui.frames.updateFrame(frameID, frame)
   // app.ui.preview.updateFrame(frameID, frame)
}
