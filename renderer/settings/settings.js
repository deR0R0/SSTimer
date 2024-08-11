// Ipc so we can quit the application!
// @ts-ignore
const ipc = window.elecApi;

// Elements
const zoominButton = document.getElementsByClassName("imgButton")[0];
const zoomoutButton = document.getElementsByClassName("imgButton")[1];
const zoomInOutTitle = document.getElementById("zoominouttitle");
const matchDetectorSlider = document.getElementById("match-detector-box");
const saveSettings = document.getElementById("save-settings");
const matchDetectorManual = document.getElementById("match-detector-manual")
const flashBoundsButton = document.getElementById("flash-bounds")
// Other Data

window.onload = function onload() {
    zoominButton.addEventListener("mousedown", () => {
        ipc.zoomIn();
    })
    zoomoutButton.addEventListener("mousedown", () => {
        ipc.zoomOut();
    })
    matchDetectorSlider.addEventListener('mousedown', () => {
        ipc.matchDetect(event, (!(matchDetectorSlider.checked)).toString())
    })
    matchDetectorManual.addEventListener("mousedown", () => {
        ipc.fillMatchData();
    })
    saveSettings.addEventListener('mousedown', () => {
        ipc.saveSettings();
    })
    flashBoundsButton.addEventListener('mousedown', () => {
        ipc.flashBorder();
    })
    ipc.message(async (event, msg) => {
        // Change checkbox to status thing idk
        matchDetectorSlider.checked = msg.matchDetect;
        zoomInOutTitle.innerHTML = `Zoom In/Out (${Math.round((msg.zoomLevel)*100)}%)`
    });
}