import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  systemPreferences,
  globalShortcut,
} from 'electron' // eslint-disable-line
import fs from 'fs';
import path from 'path';
// need to import store for vuex-electron to work
// only need to import if using createSharedMutations
import store from '../renderer/store'; // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    center: true,
    height: 640,
    minHeight: 600,
    useContentSize: true,
    width: 1080,
    minWidth: 980,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(winURL);

  globalShortcut.register('CommandOrControl+Shift+Alt+P', () => {
    mainWindow.webContents.send('toggleBoundLights');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on('clear-data', () => {
  const options = {
    type: 'question',
    buttons: ['Cancel', 'Delete data'],
    defaultId: 1,
    message: 'Delete all local data?',
    detail: 'Clearing all data will restart vhue and require you to resetup vhue. This action will not delete any data from your hue brigde.',
  };

  dialog.showMessageBox(null, options, (response) => {
    if (response) {
      const vuexStore = path.join(app.getPath('userData'), 'vuex.json');
      try {
        const stats = fs.statSync(vuexStore);
        if (stats) {
          try {
            fs.unlinkSync(vuexStore);
            app.relaunch();
            app.exit();
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

ipcMain.on('request-accessibility', () => {
  systemPreferences.isTrustedAccessibilityClient(true);
});
