/**
 * PromptForge Desktop - Electron Main Process
 *
 * Minimal Electron wrapper for local-only operation.
 * No external network calls, no telemetry, no updates.
 */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

/**
 * Create the main application window.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      // Disable all external access
      webviewTag: false
    },
    title: 'PromptForge — OVIC/VPDSF Compliant',
    backgroundColor: '#f5f5f5'
  });

  // Load the web UI
  win.loadFile(path.join(__dirname, 'ui', 'index.html'));

  // Disable menu bar (simpler UI)
  Menu.setApplicationMenu(null);

  // Prevent navigation to external URLs
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      console.warn('Blocked navigation to:', url);
    }
  });

  // Prevent opening new windows
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Development only: Open DevTools
  // win.webContents.openDevTools();
}

// Disable hardware acceleration for better compatibility
app.disableHardwareAcceleration();

// Create window when app is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Disable all webview tags
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    delete webPreferences.preload;
    delete webPreferences.preloadURL;
    webPreferences.nodeIntegration = false;
  });
});

// Security: Prevent remote module usage
delete process.env.ELECTRON_ENABLE_REMOTE_MODULE;

console.log('PromptForge Desktop - OVIC/VPDSF Compliance Mode');
console.log('Local-only operation - No external connections');
