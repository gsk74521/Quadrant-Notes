const { app } = require("electron");
const { execFile } = require("child_process");

const RUN_KEY = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
const RUN_VALUE = "QuadrantNotes";

function startupCommand() {
  if (!app.isPackaged) {
    return '"' + process.execPath + '" "' + app.getAppPath() + '"';
  }
  const exe = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;
  return '"' + exe + '"';
}

function getStartupEnabled() {
  if (process.platform === "win32") {
    return new Promise((resolve) => {
      execFile("reg", ["query", RUN_KEY, "/v", RUN_VALUE], (err) => resolve(!err));
    });
  }
  try {
    return Promise.resolve(app.getLoginItemSettings().openAtLogin);
  } catch (e) {
    return Promise.resolve(false);
  }
}

function setStartupEnabled(enabled) {
  if (process.platform === "win32") {
    return new Promise((resolve) => {
      if (enabled) {
        execFile(
          "reg",
          ["add", RUN_KEY, "/v", RUN_VALUE, "/t", "REG_SZ", "/d", startupCommand(), "/f"],
          (err) => resolve(!err)
        );
      } else {
        execFile("reg", ["delete", RUN_KEY, "/v", RUN_VALUE, "/f"], () => resolve(true));
      }
    });
  }
  try {
    app.setLoginItemSettings({ openAtLogin: !!enabled });
    return Promise.resolve(app.getLoginItemSettings().openAtLogin);
  } catch (e) {
    return Promise.resolve(false);
  }
}

module.exports = { getStartupEnabled, setStartupEnabled, startupCommand };
