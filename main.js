const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 920,
    minHeight: 620,
    title: "四象限便签 · Quadrant Notes",
    backgroundColor: "#f3ead7",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

function loginItemOptions() {
  return app.isPackaged
    ? {}
    : { path: process.execPath, args: [app.getAppPath()] };
}

ipcMain.handle("startup:get", () => {
  try {
    return app.getLoginItemSettings(loginItemOptions()).openAtLogin;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("startup:set", (_event, value) => {
  try {
    const settings = loginItemOptions();
    settings.openAtLogin = !!value;
    app.setLoginItemSettings(settings);
    return app.getLoginItemSettings(loginItemOptions()).openAtLogin;
  } catch (e) {
    return false;
  }
});

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    const template = [
      { role: "appMenu" },
      { role: "editMenu" },
      { role: "windowMenu" }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
