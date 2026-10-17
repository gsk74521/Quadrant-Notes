const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("startupAPI", {
  get: () => ipcRenderer.invoke("startup:get"),
  set: (value) => ipcRenderer.invoke("startup:set", value)
});
