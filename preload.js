const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendMediaControl: (action) => ipcRenderer.send('media-control', action),
  onMediaControl: (callback) => ipcRenderer.on('media-control', (event, action) => callback(action))
});
