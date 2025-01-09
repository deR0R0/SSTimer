const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('elecApi', {
    exitApp: () => {
        ipcRenderer.invoke("exitApp")
    },
    settingsWindow: () => {
        ipcRenderer.invoke("settingsWindow")
    },
    flashBorder: () => {
        ipcRenderer.send("flashMainWindowBorder")
    },
    zoomIn: () => {
        ipcRenderer.send("zoomIn")
    },
    zoomOut: () => {
        ipcRenderer.send("zoomOut")
    },
    matchDetect: (event, enable) => {
        ipcRenderer.send("matchDetect", enable)
    },
    saveSettings: () => {
        ipcRenderer.send("saveData");
    },
    fillMatchData: () => {
        ipcRenderer.send("fillMatchData")
    },

    // Recieveers
    message: async (data) => {
        ipcRenderer.on("message", data)
    },
})