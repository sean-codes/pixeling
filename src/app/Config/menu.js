app.config.menu = [
   {
        name: 'home',
        items: [
           { label: 'create', command: 'createDialog' },
           { label: 'open', command: 'openDialog', hint: 'ctrl-o' },
           { label: 'export', command: 'export', hint: 'ctrl-s' },
           { label: 'view', to: 'view', transition: 'forward' },
           { label: 'preview', to: 'preview', transition: 'forward' },
           { label: 'edit', to: 'edit', transition: 'forward' },
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
           { label: 'copy', hint: 'cmd-c' },
           { label: 'paste', hint: 'cmd-v' },
           { label: 'undo', hint: 'cmd-z', command: 'undo' },
           { label: 'redo', hint: 'cmd-shift-z', command: 'redo' },
           { label: 'canvas size', command: 'canvasDialog' },
           { label: 'flip', to: 'flip', transition: 'forward' }
        ]
     },
     {
        name: 'flip',
        items: [
           { label: 'back', to: 'edit', transition: 'backward' },
           { label: 'horizontal', command: 'flipHorizontal', hint: 'ctrl-shift-h' },
           { label: 'vertical', command: 'flipVertical', hint: 'ctrl-shift-v' },
        ]
     },
     {
        name: 'preview',
        items: [
           { label: 'toggle preview', command: 'togglePreview', hint: 'p' },
           { label: 'loop', command: 'togglePreviewLoop' }
        ]
     }
]