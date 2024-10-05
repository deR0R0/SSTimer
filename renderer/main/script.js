// Idek what this does
const ipc = window.elecApi;

// VERSION
const _VERSION_ = "2.0.3";


// Elements
const borderFlash = document.getElementById("flash");
const popupMessageBoard = document.getElementsByClassName("user-popup-message")[0];

const championName = document.getElementsByClassName("champion-div-names");
const spellSelectorImgs = document.getElementsByClassName("spell-selector-spells");
const championImgs = document.getElementsByClassName("champion-div-imgs");
const championImgsStatus = document.getElementsByClassName("champion-div-ps");

const spellSelector = document.getElementsByClassName("spell-selector")[0];
const spellSelectorTriangle = document.getElementsByClassName("triangle-indicator")[0];
const spellSelectorDiv = document.getElementsByClassName("spell-selector-div")[0]


var selectedSpellImgs = ["Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash"]

var selectedImg
// Other Data
var currentTime = new Date().getTime();
var latestVersion = null;
var currentUpdateStatus = "Checking for Updates..."
var spellCodeName = [
    "SummonerBarrier",
    "SummonerBoost",
    "SummonerFlash",
    "SummonerDot",
    "SummonerExhaust",
    "SummonerHaste",
    "SummonerHeal",
    "SummonerTeleport",
    "SummonerSmite"
]
var spellIGNToCodeName = {
    "Barrier": "SummonerBarrier",
    "Cleanse": "SummonerBoost",
    "Flash": "SummonerFlash",
    "Ignite": "SummonerDot",
    "Exhaust": "SummonerExhaust",
    "Ghost": "SummonerHaste",
    "Heal": "SummonerHeal",
    "Teleport": "SummonerTeleport",
    "Unleashed Teleport": "SummonerTeleport",
    "Smite": "SummonerSmite"
}
var spellDir = {
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerBarrier.png": "Barrier",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerBoost.png": "Cleanse",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerFlash.png": "Flash",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerDot.png": "Ignite",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerExhaust.png": "Exhaust",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerHaste.png": "Ghost",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerHeal.png": "Heal",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerTeleport.png": "Teleport",
    "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerSmite.png": "Smite",
}
var spellCooldowns = {

}
var champTimers = {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "9": false,
}
// Flags...
var currentlyFlashingBorder = false;

window.onload = function onload() {
    //popupMessage("Welcome Back! Version (v1.0.0)", "notice", 3000)
    // Load data...
    loadLatestPatch()
    // Event Listeners
    selectorListeners()
    toolbarListeners();
    champImgListeners();
    // Recievers
    ipcReceiver();
    // Check for updates
    updateCheck();
}

function loadLatestPatch() {
    try {
        fetch("https://ddragon.leagueoflegends.com/api/versions.json")
            .then((response) => response.json())
            .then((versions) => {
                console.log("Current Patch: " + versions[0])
                window.latestVersion = versions[0]
            })
    } catch(err) {
        popupMessage("Error while loading version... Check your internet/firewall and reload", "error", 5000);
        console.error(err)
        setTimeout(() => {
            ipc.exitApp();
        }, 5500);
    }
    setTimeout(() => {
        loadSpellData(latestVersion)
    }, 100)
}

function loadSpellData(patch) {
    try {
        fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/summoner.json`)
            .then((response) => response.json())
            .then((data) => {
                for(let i=0; i<8; i++) {
                    spellCooldown = data.data[spellCodeName[i]].cooldown[0]
                    spellCooldowns[spellCodeName[i]] = spellCooldown;
                    if(i == 7) {
                        console.log("Finished setting cooldown data...")
                    }
                }
            })
    } catch(err) {
        popupMessage("Error while loading data... Check your internet/firewall and reload", "error", 5000);
        console.error(err)
        setTimeout(() => {
            ipc.exitApp();
        }, 5500);
    }
}

function champImgListeners() {
    for(let i=0; i<10; i++) {
        championImgs[i].addEventListener("contextmenu", (event) => {
            console.log(`Changing selected image to: ${i}`)
            selectedImg = i
            moveSpellSelector(event)
        })
    }
    for(let i=0; i<10; i++) {
        championImgs[i].addEventListener("mousedown", (event) => {
            timer(championImgs[i], i);
        })
    }
}

function timer(targetedImg, number) {
    if(spellDir[targetedImg.src] == null) {
        return;
    }
    if(spellDir[targetedImg.src] == "Smite") {
        popupMessage("Smite is not useful enough to track :P", "notice", 1500)
        return;
    }
    if(champTimers[number] != false) {
        champTimers[number] = 0;
        championImgsStatus[number].style.opacity = "0";
        championImgs[number].style.opacity = "1";
        return
    }
    console.log(`Starting timer for ${number}th image`)
    championImgs[number].style.opacity = "0.5";
    champTimers[number.toString()] = spellCooldowns[spellIGNToCodeName[spellDir[targetedImg.src]]]
    championImgsStatus[number].style.opacity = 100;
    championImgsStatus[number].innerHTML = champTimers[number]
    
}

const moverButton = document.getElementById("dragtool");
const updateStatus = document.getElementById("updatetool");
const trashButton = document.getElementById("trashtool");
const settingsButton = document.getElementById("settingstool");
const exitButton = document.getElementById("exittool");
const toolbarTip = document.getElementById("toolboxTip");
function toolbarListeners() {
    trashButton.addEventListener('mousedown', () => {
        setTimeout(() => {
            trashButton.style.animation = "none"
        }, 1000)
        trashButton.style.animation = "spinWeird 1s 1 ease-in-out"
        for(let i=0; i<5; i++) {
            championName[i].value = ""
        }
        for(let i=0; i<10; i++) {
            champTimers[i] = false;
        }
        for(let i=0; i<10; i++) {
            if(i % 2 == 0) {
                championImgs[i].src = "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerHaste.png";
            } else {
                championImgs[i].src = "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/SummonerFlash.png";
            }
        }
        selectedSpellImgs = ["Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash", "Ghost", "Flash"]
    });
    settingsButton.addEventListener('mousedown', () => {
        ipc.settingsWindow();
    });
    exitButton.addEventListener('mousedown', () => {
        popupMessage("Bye Bye! 👋", "error", 2000)
        setTimeout(() => {
            ipc.exitApp();
        }, 2500)
    });

    window.addEventListener("mousemove", (event) => {
        if(event.target != moverButton && event.target != settingsButton && event.target != exitButton && event.target != updateStatus) {
            toolbarTip.style.visibility = "hidden";
        }
    })
    moverButton.addEventListener("mouseover", function() {
        toolbarTip.style.visibility = "visible";
        toolbarTip.innerHTML = "Mover, drag to move window around"
    })
    updateStatus.addEventListener("mouseover", function() {
        toolbarTip.style.visibility = "visible";
        toolbarTip.innerHTML = currentUpdateStatus
    })
    settingsButton.addEventListener("mouseover", function() {
        toolbarTip.style.visibility = "visible";
        toolbarTip.innerHTML = "Settings, opens settings window"
    })
    exitButton.addEventListener("mouseover", function() {
        toolbarTip.style.visibility = "visible";
        toolbarTip.innerHTML = "Exit"
    })
}

function moveSpellSelector(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    spellSelector.style.top = `${mouseY+25}px`;
    spellSelectorDiv.style.visibility = "visible";
    spellSelector.style.opacity = "100"
    if(!(mouseY > 190)) {
        spellSelector.style.top = `${mouseY+25}px`
        spellSelectorTriangle.style.transform = "none"
        spellSelectorTriangle.style.top = `-20px`
        
    } else {
        spellSelector.style.top = `${mouseY-170}px`;
        spellSelectorTriangle.style.transform = "scale(-1, -1)"
        spellSelectorTriangle.style.top = `130px`
    }
    if(!(mouseX > 200)) {
        spellSelector.style.left = `${mouseX-70}px`;
        spellSelectorTriangle.style.left = `${46}px`
    } else {
        spellSelector.style.left = `${201-70}px`
        spellSelectorTriangle.style.left = `${mouseX-151}px`
    }
}

function selectorListeners() {
    for(let i=0; i<9; i++) {
        spellSelectorImgs[i].addEventListener('mousedown', () => {
            if((spellDir[spellSelectorImgs[i].src] == undefined || null)) {
                spellSelector.style.visibility = "hidden"
                spellSelector.style.opacity = "0"
                updateChampImgs()
                return;
            }
            console.log("Changing spell to: " + spellDir[spellSelectorImgs[i].src])
            selectedSpellImgs[selectedImg] = spellDir[spellSelectorImgs[i].src];
            spellSelector.style.visibility = "hidden"
            spellSelector.style.opacity = "0"
            updateChampImgs()
        })
    }
}

function updateChampImgs() {
    for(let i=0; i<=9; i++) {
        if(selectedSpellImgs[i] != null) {
            championImgs[i].src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spellIGNToCodeName[selectedSpellImgs[i]]}.png`
        }
    }
}

function ipcReceiver() {
    ipc.message(async (event, msg) => {
        // Border flashing
        if(msg["message:flashBorder"]) {
            if(currentlyFlashingBorder) {
                return;
            }
            setTimeout(() => {
                currentlyFlashingBorder = false;
            }, 3000);
            currentlyFlashingBorder = true;
            flashWindowBorder();
            popupMessage("Flashing Border...", "notice", 5000)
        }
        // Match detector
        if(msg.matchDetect) {
            shouldICheckForMatch();
        }
        // Zoom In and Out
        zoom(msg.zoomLevel)
        // Save Settings Status
        if(msg["message:saveSettings"] == "success") {
            popupMessage("Saved Settings Successfully", "success", 3000)
        } else if(msg["message:saveSettings"] == "error") {
            popupMessage("Error Saving Settings! Try again later...", "error", 3000)
        }
        // Popup message for alert thing idk
        if(msg["message:matchDetect"] == "on") {
            popupMessage("Match detect is now on!", "success", 3000)
        } else if(msg["message:matchDetect"] == "off") {
            popupMessage("Match detect is now off!", "error", 3000)
        }
        // Manual fill
        if(msg["message:fillMatchData"]) {
            checkMatch(true)
        }
    });
}

var lastTimeSinceChecked = 100;
function shouldICheckForMatch() {
    if(lastTimeSinceChecked >= 100) {
        checkMatch(false);
        lastTimeSinceChecked = 0;
    } else {
        lastTimeSinceChecked++;
    }
}


async function flashWindowBorder() {
    for(let i=1; i<=10; i++) {
        await sleep(500);
        if(i % 2 !== 0) {
            borderFlash.style.opacity = "100";
        } else {
            borderFlash.style.opacity = "0";
        }
    }
}

async function zoom(level) {
    rootVars = document.querySelector(':root');
    rootVarsCS = window.getComputedStyle(rootVars);
    currentScaleFactor = rootVarsCS.getPropertyValue('--scale-factor');
    if(currentScaleFactor < level) {
        popupMessage("Zooming In", "notice", 1500);
    } else if(currentScaleFactor > level) {
        popupMessage("Zooming Out", "notice", 1500);
    }
    rootVars.style.setProperty('--scale-factor', level)
}


var currentlyDisplayingMessage = false;
async function popupMessage(message, type, duration) {
    if(currentlyDisplayingMessage) {
        return;
    }
    currentlyDisplayingMessage = true;
    if(type == "error") {
        popupMessageBoard.style.backgroundColor = "#f95668";
        popupMessageBoard.style.borderColor = "#f95668";
    } else if(type == "notice") {
        popupMessageBoard.style.backgroundColor = "#4285f4";
        popupMessageBoard.style.borderColor = "#4285f4";
    } else if(type == "success") {
        popupMessageBoard.style.backgroundColor = "#09c97f";
        popupMessageBoard.style.borderColor = "#09c97f";
    } else if(type == "warning") {
        popupMessageBoard.style.backgroundColor = "#f8b15d";
        popupMessageBoard.style.borderColor = "#09c97f";
    } else {
        console.log("fml, so many errors that i have to fix aoidsjfaspodijgpoijafpoiajwepoij")
    }

    popupMessageBoard.innerHTML = message;
    setTimeout(() => {
        popupMessageBoard.style.top = "-18%"
        setTimeout(() => {
            currentlyDisplayingMessage = false;
        }, 500)
    }, duration)
    popupMessageBoard.style.top = "0.08%";
}


// Always keep updating the time :)
// and keep updating the timer
window.setInterval(() => {
    currentTime = new Date().getTime();
    for(let i=0; i<10; i++) {
        if(champTimers[i] != false) {
            champTimers[i] = champTimers[i] - 1
            championImgsStatus[i].innerHTML = champTimers[i]
            if(champTimers[i] <= 0) {
                champTimers[i] = false;
            }
            if(champTimers[i].toString().length == 2) {
                if(i % 2 == 0) {
                    championImgsStatus[i].style.left = `176px`
                } else {
                    championImgsStatus[i].style.left = `227px`
                }
            }
        } else {
            championImgsStatus[i].style.opacity = "0";
            championImgsStatus[i].style.opacity = "0";
            championImgs[i].style.opacity = "1";
        }
    }
}, 1000);

// Check for a match!
function checkMatch(popup) {
    //https://static.developer.riotgames.com/docs/lol/liveclientdata_sample.json
    //
    fetch("https://127.0.0.1:2999/liveclientdata/allgamedata", {})
        .then((response) => response.json())
        .then(playerdata => {
            try {
                currentPlayerBotSide = false;
                currentPlayer = playerdata.activePlayer.riotId
                // i couldn't tell you whats going on if i knew
                for(let i=0; i<5; i++) {
                    console.log(playerdata.allPlayers[i].riotId)
                    console.log(currentPlayer)
                    if(playerdata.allPlayers[i].riotId == currentPlayer) {
                        currentPlayerBotSide = true;
                        break;
                    }
                }
                console.log("-------")
                for(let i=0; i<5; i++) {
                    if(!currentPlayerBotSide) {
                        playerName = playerdata.allPlayers[i].championName;
                    } else {
                        playerName = playerdata.allPlayers[i+5].championName;
                    }
                    
                    championName[i].value = playerName
                }
                for(let i=0; i<10; i+=2) {
                    x = i / 2
                    if(!currentPlayerBotSide) {
                        playerSummonerSpells = playerdata.allPlayers[x].summonerSpells;
                    } else {
                        playerSummonerSpells = playerdata.allPlayers[x+5].summonerSpells;
                    }
                    championImgs[i].src = `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/${spellIGNToCodeName[playerSummonerSpells.summonerSpellOne.displayName]}.png`
                    championImgs[i+1].src = `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/spell/${spellIGNToCodeName[playerSummonerSpells.summonerSpellTwo.displayName]}.png`
                    selectedSpellImgs[i] = spellDir[championImgs[i].src]
                    selectedSpellImgs[i+1] = spellDir[championImgs[i+1].src]
                }
                if(popup) {
                    popupMessage("Found Game!", "success", 3000)
                }
                
            } catch(err) {
                console.error(err)
            }
        })
    .catch(() => {
        if(popup) {
            popupMessage("Match Not Found! (only rift/aram)", "error", 3000)
        }
    })
}

function updateCheck() {
    //URL = https://api.github.com/repos/der0r0/sstimer/releases/latest
    fetch("https://api.github.com/repos/der0r0/sstimer/releases/latest")
        .then((response) => response.json())
        .then((json) => {
            setTimeout(() => {
                if(json.tag_name == `v${_VERSION_}`) {
                    console.log(`Up to Date. Current Version: v${_VERSION_}`)
                    updateStatus.src = "../assets/updated.svg"
                    updateStatus.style.animation = "none"
                    currentUpdateStatus = "Up To Date!"
                } else {
                    console.log(`Update Needed. From version v${_VERSION_} -> ${json.tag_name}`)
                    updateStatus.src = "../assets/outdated.svg"
                    updateStatus.style.animation = "none"
                    currentUpdateStatus = `Update Needed! (${_VERSION_} -> ${json.tag_name})`
                }
            }, 980)
            
        })
}
// Sleep? idk
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))