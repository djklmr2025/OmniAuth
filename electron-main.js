
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Detectar si estamos en modo desarrollo o empaquetado
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 720,
    title: "OmniAuth Secure 2FA",
    backgroundColor: '#0f172a', // Color slate-900 para evitar destellos blancos al cargar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Opcional para funciones nativas
    },
    resizable: false, // Mantener tamaño tipo móvil para estética de autenticador
    autoHideMenuBar: true, // Limpieza visual absoluta
    icon: path.join(__dirname, 'icon.ico')
  });

  if (isDev) {
    // Carga desde el servidor de desarrollo local
    win.loadURL('http://localhost:3000');
  } else {
    // Carga el archivo compilado en producción
    win.loadFile(path.join(__dirname, 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
