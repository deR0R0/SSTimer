const path = require('path')
const {app, BrowserWindow, Menu} = require('electron');

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin";

//Menu
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "SSTimer",
        //Normal is 310x800
        width: 310,
        height: 800,
        resizable: false,
        frame: false,
        transparent: true,
        webPreferences: {
            devTools: false
        }
    });
    mainWindow.setFocusable(true);
    mainWindow.setAlwaysOnTop(true);
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}
//When ready, create the window
app.whenReady().then(() => {
    createMainWindow();

    // Remove ugly ahh menu
    Menu.setApplicationMenu(null);

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