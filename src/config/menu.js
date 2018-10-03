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
           { label: 'zoom in', command: 'zoomIn' },
           { label: 'zoom out', command: 'zoomOut' },
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
           { label: 'flip', to: 'flip', transition: 'forward' },
           { label: 'rotate', to: 'rotate', transition: 'forward' }
        ]
     },
     {
        name: 'flip',
        items: [
           { label: 'back', to: 'edit', transition: 'backward' },
           { label: 'horizontal' },
           { label: 'vertical' },
        ]
     },
     {
        name: 'rotate',
        items: [
           { label: 'back', to: 'edit', transition: 'backward' },
           { label: '90deg CW' },
           { label: '90deg CCW' },
           { label: '180deg' }
        ]
     }
]
