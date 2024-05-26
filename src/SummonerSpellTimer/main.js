const path = require('path')
const {app, ipcMain, BrowserWindow, Menu} = require('electron');

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin";

//Menu
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "SSTimer",
        //Normal is 290x500
        width: 270,
        height: 460,
        resizable: false,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });
    mainWindow.setFocusable(true);
    mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}
//When ready, create the window
app.whenReady().then(() => {
    createMainWindow();

    // Remove ugly ahh menu
    Menu.setApplicationMenu(null);

    ipcMain.on("close", () => {
        app.quit();
    });

    //create just in case :)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

    //Creat he menu
    const menu = [
        {
            label: "File",
            submenu: [
                {
                    label: "Exit",
                    click: () => app.quit()
                }
            ]
        }
    ]

    //Check for macing
    app.on('window-all-closed', () => {
        if (!isMac) {
            app.quit();
        }
    });
});