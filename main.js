const { app, BrowserWindow, Menu, Notification, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const windowStateKeeper = require('electron-window-state');

app.setName('Davibe'); // Set the application name early

  // Vérifier les mises à jour
  autoUpdater.checkForUpdatesAndNotify();

  // Gérer les événements de mise à jour
autoUpdater.on('update-available', () => {
  console.log('Mise à jour disponible.');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Mise à jour téléchargée; l\'application sera mise à jour au prochain lancement.');
});

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'img', 'favicon.ico'); // Chemin vers votre icône

  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  // Create the browser window
  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: true,  // Enable the default frame
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // Required for contextBridge to work
      enableRemoteModule: false,  // Recommended to disable
    },
    icon: iconPath
  });

  mainWindowState.manage(win);

  // Masquer les menus par défaut
  Menu.setApplicationMenu(null);

  win.loadURL('https://davibe.fr');

  // Ouvrir les outils de développement
  // win.webContents.openDevTools();

  // Définir les boutons de la barre d'outils miniature
  const thumbBarButtons = [
    {
      icon: path.join(__dirname, 'assets', 'img', 'prev.png'), // Chemin vers l'icône de "précédent"
      click: () => {
        win.webContents.send('media-control', 'previous');
      },
      tooltip: 'Previous',
      flags: ['enabled']
    },
    {
      icon: path.join(__dirname, 'assets', 'img', 'play.png'), // Chemin vers l'icône de "lecture/pause"
      click: () => {
        win.webContents.send('media-control', 'play-pause');
      },
      tooltip: 'Play/Pause',
      flags: ['enabled']
    },
    {
      icon: path.join(__dirname, 'assets', 'img', 'next.png'), // Chemin vers l'icône de "suivant"
      click: () => {
        win.webContents.send('media-control', 'next');
      },
      tooltip: 'Next',
      flags: ['enabled']
    }
  ];

  win.setThumbarButtons(thumbBarButtons);
}

// Écouter les commandes de contrôle des médias depuis le processus de rendu
ipcMain.on('media-control', (event, action) => {
  console.log(`Media control action: ${action}`);
  // Ajoutez ici la logique pour chaque action, par exemple :
  // if (action === 'play-pause') {
  //   // Logique pour lecture/pause
  // }
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
