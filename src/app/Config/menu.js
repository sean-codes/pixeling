app.config.menu = [
   {
        name: 'home',
        items: [
           { label: 'create', command: 'createDialog' },
           { label: 'open', command: 'open', hint: 'ctrl-o' },
           { label: 'export', command: 'export', hint: 'ctrl-s' },
           { label: 'edit', to: 'edit', transition: 'forward' },
           { label: 'view', to: 'view', transition: 'forward' },
           { label: 'preview', to: 'preview', transition: 'forward' },
           { label: 'toggle fullscreen', command: 'toggleFullscreen' },
        ]
     },
     {
        name: 'view',
        items: [
           { label: 'back', to: 'home', transition: 'backward' },
           { label: 'color mixer', command: 'toggleColorMixer', hint: 'ctrl-c' },
           { label: 'frames', command: 'toggleFrames', hint: 'f' },
           { label: 'preview', command: 'togglePreview', hint: 'p' },
           { label: 'center', command: 'center' },
           { label: 'zoom in', command: 'zoomIn', hint: 'ctrl-scrollwheel' },
           { label: 'zoom out', command: 'zoomOut', hint: 'ctrl-scrollwheel' },
           { label: 'zoom reset', command: 'zoomReset' },
           { label: 'onion frames', command: 'onionFramesDialog' }
        ]
     },
     {
        name: 'edit',
        items: [
           { label: 'back', to: 'home', transition: 'backward' },
           { label: 'copy', hint: 'ctrl-c', command: 'copy' },
           { label: 'paste', hint: 'ctrl-v', command: 'paste' },
           { label: 'undo', hint: 'ctrl-z', command: 'undo', stay_open: true },
           { label: 'redo', hint: 'ctrl-shift-z', command: 'redo', stay_open: true },
           { label: 'delete', command: 'delete' },
           { label: 'flip h', command: 'flipHorizontal', hint: 'ctrl-shift-h' },
           { label: 'flip v', command: 'flipVertical', hint: 'ctrl-shift-v' },
           { label: 'crop', command: 'crop' },
           { label: 'canvas size', command: 'canvasDialog' },
           { label: 'make frames', command: 'makeFramesDialog' }
        ]
     },
     {
        name: 'preview',
        items: [
           { label: 'back', to: 'home', transition: 'backward' },
           { label: 'toggle preview', command: 'togglePreview', hint: 'p' },
           { label: 'loop', command: 'togglePreviewLoop', hint: 'ctrl-shift-p' }
        ]
     }
]
