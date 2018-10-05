app.config.menu = [
   {
        name: 'home',
        items: [
           { label: 'create', command: 'createDialog' },
           { label: 'open', command: 'openDialog', hint: 'ctrl-o' },
           { label: 'export', command: 'export', hint: 'ctrl-s' },
           { label: 'edit', to: 'edit', transition: 'forward' },
           { label: 'view', to: 'view', transition: 'forward' }
        ]
     },
     {
        name: 'view',
        items: [
           { label: 'back', to: 'home', transition: 'backward' },
           { label: 'center', command: 'center' },
           { label: 'zoom in', command: 'zoomIn', hint: 'ctrl-scrollwheel' },
           { label: 'zoom out', command: 'zoomOut', hint: 'ctrl-scrollwheel' },
           { label: 'zoom reset', command: 'zoomReset' }
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
     }
]
