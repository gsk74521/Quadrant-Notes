const { app, BrowserWindow, Menu } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const iconPath = path.join(
    __dirname,
    "build",
    process.platform === "win32" ? "icon.ico" : "icon.png"
  );
  const windowOptions = {
    width: 1320,
    height: 860,
    minWidth: 920,
    minHeight: 620,
    title: "四象限便签 · Quadrant Notes",
    backgroundColor: "#f3ead7",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  };

  if (!app.isPackaged && fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
    if (process.platform === "darwin" && app.dock) {
      app.dock.setIcon(iconPath);
    }
  }

  const win = new BrowserWindow(windowOptions);

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

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
