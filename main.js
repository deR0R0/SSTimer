const path = require('path')
const fs = require('fs');
const {app, ipcMain, BrowserWindow, Menu} = require('electron/main');

var matchDetect;


const isMac = process.platform === "darwin";

const mainWidth = 270;
const mainHeight = 370;

var data = {
    "zoomLevel": 1,
    "matchDetect": true,
    "message:flashBorder": false,
    "message:fillMatchData": false,
    "message:matchDetect": "none",
    "message:saveSettings": "none",
};

var settingsWindow;

app.commandLine.appendSwitch("ignore-certificate-errors")

// Main Window
function createMainWindow(width, height, dev) {
    const mainWindow = new BrowserWindow({
        title: "SSTimer (v2)",
        //Normal is 270x460
        width: width,
        height: height,
        resizable: false,
        frame: dev,
        transparent: !dev,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            devTools: dev,
            preload: path.join(__dirname, "./preload.js")
        }
    });
    mainWindow.setFocusable(true);
    mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    mainWindow.loadFile(path.join(__dirname, './renderer/main/index.html'));
    setInterval(async () => {
        // Send data from main to the main window
        mainWindow.webContents.send("message", data);
        //console.log("Sending packet of data to main window...")
    }, 100)
    mainWindow.on("closed", () => {
        app.quit();
    })
}

// Settings Window
function createSettingsWindow(width, height, dev) {
    // Creating window next to main window
    sel_win = BrowserWindow.getFocusedWindow();
    sel_win_pos = sel_win.getPosition();
    settingsWindow = new BrowserWindow({
        title: "SSTimer (v2) Settings",
        //Normal is 270x400
        width: width,
        height: height,
        x: sel_win_pos[0] - 500,
        y: sel_win_pos[1],
        resizable: false,
        frame: true,
        transparent: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            devTools: dev,
            preload: path.join(__dirname, "./preload.js")
        }
    })
    settingsWindow.setFocusable(true);
    settingsWindow.focus();
    settingsWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    settingsWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    settingsWindow.loadFile(path.join(__dirname, './renderer/settings/settings.html'));
    settingsdatatransfer = setInterval(async () => {
        // Send data from main to the settings window
        settingsWindow.webContents.send("message", data);
        //console.log("Sending packet of data to main window...")
    }, 1000)
    settingsWindow.on("closed", () => {
        clearInterval(settingsdatatransfer)
    })
    return settingsWindow
}

// Load settings function
function loadSettings() {
    console.log("Attempting to load settings file!")
    if(fs.existsSync("./settings.json")) {
        console.log("Data file exists.. overwriting default settings.")
        try {
            data = JSON.parse(fs.readFileSync("./settings.json"))
        } catch(err) {
            console.log("Error has occursed while reading file: ")
            console.error(err);
            return "errReadingFile"
        }
    } else {
        console.log("File doesn't exist, creating data file...")
        try {
            fs.writeFileSync("./settings.json", JSON.stringify(data))
        } catch(err) {
            console.log("Error while creating settings: ")
            console.error(err)
            return "errorCreatingSettings";
        }
    }
    return "success"
}

var saveSettingsFlag = false;
function saveSettings() {
    if(saveSettingsFlag) {
        return;
    }
    saveSettingsFlag = true;
    console.log("Attempting to save settings...");
    try {
        fs.writeFileSync("./settings.json", JSON.stringify(data));
        data['message:saveSettings'] = "success";
        console.log("Saved settings successfully!")
        setTimeout(async () => {
            saveSettingsFlag = false;
            data['message:saveSettings'] = "none";
        }, 100)
    } catch(err) {
        console.log("Error while saving settings: ")
        console.error(err)
        data['message:saveSettings'] = "error";
        setTimeout(async () => {
            saveSettingsFlag = false;
            data['message:saveSettings'] = "none";
        }, 100)
    }
}

// When ready, create the window
app.whenReady().then(() => {
    // Load the settings
    loadSettings();
    // Fix message settings (in case user saved during a message)
    data['message:fillMatchData'] = false;
    data['message:flashBorder'] = false;
    data['message:matchDetect'] = "none";
    data['message:saveSettings'] = "none";
    // Create the main window (where the summoner spells will be)
    createMainWindow(mainWidth, mainHeight, false);

    // Remove ugly menu for windows
    //Menu.setApplicationMenu(null);


    // Close application on ipc
    ipcMain.handle("exitApp", () => {
        app.quit();
    });

    // Create settings window
    ipcMain.handle("settingsWindow", () => {
        if(BrowserWindow.getAllWindows().length < 2) {
            createSettingsWindow(500, 500, true);
            console.log("Created a settings window!")
        } else {
            console.warn("User attempted to create another settings window but a settings window is already open.");
            console.log("Going to focus the settings window for the user!");
            if(settingsWindow.isMinimized()) {
                console.log("-_- user minimized the window. can't do anything about that")
            }
            settingsWindow.focus();
        }
        
    });

    // Flashing main border
    ipcMain.on("flashMainWindowBorder", () => {
        console.log("Flashing the main window's border")
        data['message:flashBorder'] = true;
        setTimeout(() => {
            data['message:flashBorder'] = false;
        }, 100)
    });

    // Zooming in and out
    ipcMain.on("zoomIn", () => {
        console.log("Zooming in main window")
        data.zoomLevel = data.zoomLevel + 0.05;
    })
    ipcMain.on("zoomOut", () => {
        console.log("Zooming out main window")
        data.zoomLevel = data.zoomLevel - 0.05;
    })

    // Match detector
    ipcMain.on("matchDetect", (event, enable) => {
        console.log("Changing match detect to: " + enable)
        setTimeout(() => {
            data['message:matchDetect'] = "none";
        }, 100)
        if(enable == "true") {
            data['message:matchDetect'] = "on";
        } else if(enable == "false") {
            data['message:matchDetect'] = "off";
        }
        data.matchDetect = enable == "true"
    })

    // Match data fill in manual
    ipcMain.on("fillMatchData", () => {
        console.log("Sending a request to fill in match data!");
        data['message:fillMatchData'] = true;
        setTimeout(() => {
            data['message:fillMatchData'] = false;
        }, 100)
    })
    
    // Save setting data
    ipcMain.on("saveData", () => {
        saveSettings();
    })

    //create just in case :)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow(270, 460, false);
        }
    });

    //Check for mac
    app.on('window-all-closed', () => {
        if (!isMac) {
            app.quit();
        }
    });
});