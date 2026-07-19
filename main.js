const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {

  app.whenReady().then(createWindow);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    icon: path.join(__dirname, 'assets/logos/logo.ico'),
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  mainWindow.loadFile('index.html');

  ipcMain.on('window-controls', (event, action) => {
    if (action === 'close') mainWindow.close();
    if (action === 'minimize') mainWindow.minimize();
    if (action === 'toggle-size') {
      const [width, height] = mainWindow.getSize();
      mainWindow.setResizable(true);
      if (width === 300) {
        mainWindow.setSize(600, 450);
      } else {
        setTimeout(() => {
          mainWindow.setSize(300, 450);
        }, 300);
      }
    }
  });

}