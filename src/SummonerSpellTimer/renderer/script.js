const currentVersion = "1.0.0";
var statusUpdate = "Checking for Updates"

var currentTime = "";

var spellCooldowns = {
    "Barrier": 180,
    "Cleanse": 240,
    "Exhaust": 240,
    "Flash": 300,
    "Ghost": 240,
    "Heal": 240,
    "Ignite": 180,
    "Smite-Cooldown": 90,  //should be 15 when impletmeented
    /*"Smite-Recharge": 90,*/
    "Teleport": 360
}

var currentlyTiming = {
    "Champ1Spell1": false,
    "Champ1Spell2": false,
    "Champ2Spell1": false,
    "Champ2Spell2": false,
    "Champ3Spell1": false,
    "Champ3Spell2": false,
    "Champ4Spell1": false,
    "Champ4Spell2": false,
    "Champ5Spell1": false,
    "Champ5Spell2": false,
}

var root = document.querySelector(':root');

const champ1img1 = document.getElementById("champ1Img");
const champ1img2 = document.getElementById("champ1Img2");
const champ1img1Time = document.getElementById("champ1ImgTime");
const champ1img2Time = document.getElementById("champ1Img2Time");

var champ1Spell1 = "Flash";
var champ1Spell2 = "Ghost";

const champ2img1 = document.getElementById("champ2Img");
const champ2img2 = document.getElementById("champ2Img2");
const champ2img1Time = document.getElementById("champ2ImgTime");
const champ2img2Time = document.getElementById("champ2Img2Time");

var champ2Spell1 = "Flash";
var champ2Spell2 = "Ghost";

const champ3img1 = document.getElementById("champ3Img");
const champ3img2 = document.getElementById("champ3Img2");
const champ3img1Time = document.getElementById("champ3ImgTime");
const champ3img2Time = document.getElementById("champ3Img2Time");

var champ3Spell1 = "Flash";
var champ3Spell2 = "Ghost";

const champ4img1 = document.getElementById("champ4Img");
const champ4img2 = document.getElementById("champ4Img2");
const champ4img1Time = document.getElementById("champ4ImgTime");
const champ4img2Time = document.getElementById("champ4Img2Time");

var champ4Spell1 = "Flash";
var champ4Spell2 = "Ghost";

const champ5img1 = document.getElementById("champ5Img");
const champ5img2 = document.getElementById("champ5Img2");
const champ5img1Time = document.getElementById("champ5ImgTime");
const champ5img2Time = document.getElementById("champ5Img2Time");

var champ5Spell1 = "Flash";
var champ5Spell2 = "Ghost";

const barrierSelector = document.getElementById("barrier-selector");
const cleanseSelector = document.getElementById("cleanse-selector");
const exhaustSelector = document.getElementById("exhaust-selector");
const flashSelector = document.getElementById("flash-selector");
const ghostSelector = document.getElementById("ghost-selector");
const healSelector = document.getElementById("heal-selector");
const igniteSelector = document.getElementById("ignite-selector");
const smiteSelector = document.getElementById("smite-selector");
const teleportSelector = document.getElementById("teleport-selector");
const exitSelector = document.getElementById("exit-selector");

const spellSelector = document.getElementById("spell-selector");

const appMover = document.getElementById("dragarea");
const updateStatus = document.getElementById("updatestatus");
const sizeIncreaser = document.getElementById("increasesize");
const sizeDecreaser = document.getElementById("decreasesize");
const info = document.getElementById("info")

var currentSelectedImg = null;


window.onload = function createChampListeners() {
    //Check for Update
    updateCheck();
    //Champ 1
    champ1img1.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP1IMG1");
    });
    champ1img2.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP1IMG2");
    });
    //Champ 2
    champ2img1.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP2IMG1");
    });
    champ2img2.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP2IMG2");
    });
    //Champ 3
    champ3img1.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP3IMG1");
    });
    champ3img2.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP3IMG2");
    });
    //Champ 4
    champ4img1.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP4IMG1");
    });
    champ4img2.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP4IMG2");
    });
    //Champ 5
    champ5img1.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP5IMG1");
    });
    champ5img2.addEventListener("contextmenu", function(coords) {
        popupSpellSelector(coords, "CHAMP5IMG2");
    });
    //Misc
    sizeIncreaser.addEventListener("mousedown", function() {
        changeSize("Increase");
    });
    sizeDecreaser.addEventListener("mousedown", function() {
        changeSize("Decrease");
    });

    window.addEventListener("mousemove", function(event) {
        if(event.target != updateStatus && event.target != appMover && event.target != sizeIncreaser && event.target != sizeDecreaser) {
            info.style.visibility = "hidden";
        } 
    });
    appMover.addEventListener("mouseover", function() {
        info.style.visibility = "visible";
        info.style.left = "0px";
        info.innerHTML = "Mover, hold and drag."
    });
    updateStatus.addEventListener("mouseover", function() {
        info.style.visibility = "visible";
        info.style.left = "0px";
        info.innerHTML = statusUpdate;
    });
    sizeIncreaser.addEventListener("mouseover", function() {
        info.style.visibility = "visible";
        info.style.left = "70px";
        info.innerHTML = "Zoom In"
    });
    sizeDecreaser.addEventListener("mouseover", function() {
        info.style.visibility = "visible";
        info.style.left = "100px";
        info.innerHTML = "Zoom Out"
    });
    createChampListeners2();
}

function createChampListeners2() {
    //Champ 1
    champ1img1.addEventListener("mousedown", function() {
        if(currentlyTiming["Champ1Spell1"] == false) {
            timeUntilDone = currentTime + spellCooldowns[champ1Spell1];
            champ1img1Time.style.opacity = "1";
            champ1img1.style.opacity = "0.5";
            currentlyTiming["Champ1Spell1"] = true;
            function counter() {
                if(currentTime >= timeUntilDone || currentlyTiming["Champ1Spell1"] == false) {
                    currentlyTiming["Champ1Spell1"] = false;
                    champ1img1Time.style.opacity = "0";
                    champ1img1.style.opacity = "1";
                } else {
                    champ1img1Time.innerHTML = timeUntilDone-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ1Spell1"] = false;
            champ1img1Time.style.opacity = "0";
            champ1img1.style.opacity = "1";
        }
    });
    champ1img2.addEventListener("mousedown", function() {
        if(currentlyTiming["Champ1Spell2"] == false) {
            timeUntilDone2 = currentTime + spellCooldowns[champ1Spell2];
            champ1img2Time.style.opacity = "1";
            champ1img2.style.opacity = "0.5";
            currentlyTiming["Champ1Spell2"] = true;
            function counter() {
                if(currentTime >= timeUntilDone2 || currentlyTiming["Champ1Spell2"] == false) {
                    currentlyTiming["Champ1Spell2"] = false;
                    champ1img2Time.style.opacity = "0";
                    champ1img2.style.opacity = "1";
                } else {
                    champ1img2Time.innerHTML = timeUntilDone2-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ1Spell2"] = false;
            champ1img2Time.style.opacity = "0";
            champ1img2.style.opacity = "1";
        }
    });
    //Champ 2
    champ2img1.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ2Spell1"] == false) {
            timeUntilDone3 = currentTime + spellCooldowns[champ2Spell1];
            champ2img1Time.style.opacity = "1";
            champ2img1.style.opacity = "0.5";
            currentlyTiming["Champ2Spell1"] = true;
            function counter() {
                if(currentTime >= timeUntilDone3 || currentlyTiming["Champ2Spell1"] == false) {
                    currentlyTiming["Champ2Spell1"] = false;
                    champ2img1Time.style.opacity = "0";
                    champ2img1.style.opacity = "1";
                } else {
                    champ2img1Time.innerHTML = timeUntilDone3-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ2Spell1"] = false;
            champ2img1Time.style.opacity = "0";
            champ2img1.style.opacity = "1";
        }
    });
    champ2img2.addEventListener("mousedown", function() {
        if(currentlyTiming["Champ2Spell2"] == false) {
            timeUntilDone4 = currentTime + spellCooldowns[champ2Spell2];
            champ2img2Time.style.opacity = "1";
            champ2img2.style.opacity = "0.5";
            currentlyTiming["Champ2Spell2"] = true;
            function counter() {
                if(currentTime >= timeUntilDone4 || currentlyTiming["Champ2Spell2"] == false) {
                    currentlyTiming["Champ2Spell2"] = false;
                    champ2img2Time.style.opacity = "0";
                    champ2img2.style.opacity = "1";
                } else {
                    champ2img2Time.innerHTML = timeUntilDone4-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ2Spell2"] = false;
            champ2img2Time.style.opacity = "0";
            champ2img2.style.opacity = "1";
        }
    });
    //Champ 3
    champ3img1.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ3Spell1"] == false) {
            timeUntilDone5 = currentTime + spellCooldowns[champ3Spell1];
            champ3img1Time.style.opacity = "1";
            champ3img1.style.opacity = "0.5";
            currentlyTiming["Champ3Spell1"] = true;
            function counter() {
                if(currentTime >= timeUntilDone5 || currentlyTiming["Champ3Spell1"] == false) {
                    currentlyTiming["Champ3Spell1"] = false;
                    champ3img1Time.style.opacity = "0";
                    champ3img1.style.opacity = "1";
                } else {
                    champ3img1Time.innerHTML = timeUntilDone5-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ3Spell1"] = false;
            champ3img1Time.style.opacity = "0";
            champ3img1.style.opacity = "1";
        }
    });
    champ3img2.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ3Spell2"] == false) {
            timeUntilDone6 = currentTime + spellCooldowns[champ3Spell2];
            champ3img2Time.style.opacity = "1";
            champ3img2.style.opacity = "0.5";
            currentlyTiming["Champ3Spell2"] = true;
            function counter() {
                if(currentTime >= timeUntilDone6 || currentlyTiming["Champ3Spell2"] == false) {
                    currentlyTiming["Champ3Spell2"] = false;
                    champ3img2Time.style.opacity = "0";
                    champ3img2.style.opacity = "1";
                } else {
                    champ3img2Time.innerHTML = timeUntilDone6-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ3Spell2"] = false;
            champ3img2Time.style.opacity = "0";
            champ3img2.style.opacity = "1";
        }
    });
    //Champ 4
    champ4img1.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ4Spell1"] == false) {
            timeUntilDone7 = currentTime + spellCooldowns[champ4Spell1];
            champ4img1Time.style.opacity = "1";
            champ4img1.style.opacity = "0.5";
            currentlyTiming["Champ4Spell1"] = true;
            function counter() {
                if(currentTime >= timeUntilDone7 || currentlyTiming["Champ4Spell1"] == false) {
                    currentlyTiming["Champ4Spell1"] = false;
                    champ4img1Time.style.opacity = "0";
                    champ4img1.style.opacity = "1";
                } else {
                    champ4img1Time.innerHTML = timeUntilDone7-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ4Spell1"] = false;
            champ4img1Time.style.opacity = "0";
            champ4img1.style.opacity = "1";
        }
    });
    champ4img2.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ4Spell2"] == false) {
            timeUntilDone8 = currentTime + spellCooldowns[champ4Spell2];
            champ4img2Time.style.opacity = "1";
            champ4img2.style.opacity = "0.5";
            currentlyTiming["Champ4Spell2"] = true;
            function counter() {
                if(currentTime >= timeUntilDone8 || currentlyTiming["Champ4Spell2"] == false) {
                    currentlyTiming["Champ4Spell2"] = false;
                    champ4img2Time.style.opacity = "0";
                    champ4img2.style.opacity = "1";
                } else {
                    champ4img2Time.innerHTML = timeUntilDone8-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ4Spell2"] = false;
            champ4img2Time.style.opacity = "0";
            champ4img2.style.opacity = "1";
        }
    });
    //Champ 5
    champ5img1.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ5Spell1"] == false) {
            timeUntilDone9 = currentTime + spellCooldowns[champ5Spell1];
            champ5img1Time.style.opacity = "1";
            champ5img1.style.opacity = "0.5";
            currentlyTiming["Champ5Spell1"] = true;
            function counter() {
                if(currentTime >= timeUntilDone9 || currentlyTiming["Champ5Spell1"] == false) {
                    currentlyTiming["Champ5Spell1"] = false;
                    champ5img1Time.style.opacity = "0";
                    champ5img1.style.opacity = "1";
                } else {
                    champ5img1Time.innerHTML = timeUntilDone9-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ5Spell1"] = false;
            champ5img1Time.style.opacity = "0";
            champ5img1.style.opacity = "1";
        }
    });
    champ5img2.addEventListener("mousedown", function(coords) {
        if(currentlyTiming["Champ5Spell2"] == false) {
            timeUntilDone10 = currentTime + spellCooldowns[champ5Spell2];
            champ5img2Time.style.opacity = "1";
            champ5img2.style.opacity = "0.5";
            currentlyTiming["Champ5Spell2"] = true;
            function counter() {
                if(currentTime >= timeUntilDone10 || currentlyTiming["Champ5Spell2"] == false) {
                    currentlyTiming["Champ5Spell2"] = false;
                    champ5img2Time.style.opacity = "0";
                    champ5img2.style.opacity = "1";
                } else {
                    champ5img2Time.innerHTML = timeUntilDone10-currentTime;
                    setTimeout(counter, 1000);
                }
            }
            counter()
        } else {
            currentlyTiming["Champ5Spell2"] = false;
            champ5img2Time.style.opacity = "0";
            champ5img2.style.opacity = "1";
        }
    });
    createSelectorListeners();
}

function createSelectorListeners() {
    exitSelector.addEventListener("mousedown", function() {
        spellSelector.style.visibility = "hidden";
    });
    barrierSelector.addEventListener("mousedown", function() {
        changeSpell("Barrier");
        spellSelector.style.visibility = "hidden";
    });
    cleanseSelector.addEventListener("mousedown", function() {
        changeSpell("Cleanse");
        spellSelector.style.visibility = "hidden";
    });
    exhaustSelector.addEventListener("mousedown", function() {
        changeSpell("Exhaust");
        spellSelector.style.visibility = "hidden";
    });
    flashSelector.addEventListener("mousedown", function() {
        changeSpell("Flash");
        spellSelector.style.visibility = "hidden";
    });
    ghostSelector.addEventListener("mousedown", function() {
        changeSpell("Ghost");
        spellSelector.style.visibility = "hidden";
    });
    healSelector.addEventListener("mousedown", function() {
        changeSpell("Heal");
        spellSelector.style.visibility = "hidden";
    });
    igniteSelector.addEventListener("mousedown", function() {
        changeSpell("Ignite");
        spellSelector.style.visibility = "hidden";
    });
    smiteSelector.addEventListener("mousedown", function() {
        changeSpell("Smite");
        spellSelector.style.visibility = "hidden";
    });
    teleportSelector.addEventListener("mousedown", function() {
        changeSpell("Teleport");
        spellSelector.style.visibility = "hidden";
    });
    updateCheck()
}

function changeSpell(spell) {
    if(currentSelectedImg == "CHAMP1IMG1") {
        champ1Spell1 = spell;
        champ1img1.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ1Spell1"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP1IMG2") {
        champ1Spell2 = spell;
        champ1img2.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ1Spell2"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP2IMG1") {
        champ2Spell1 = spell;
        champ2img1.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ2Spell1"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP2IMG2") {
        champ2Spell2 = spell;
        champ2img2.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ2Spell2"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP3IMG1") {
        champ3Spell1 = spell;
        champ3img1.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ3Spell1"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP3IMG2") {
        champ3Spell2 = spell;
        champ3img2.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ3Spell2"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP4IMG1") {
        champ4Spell1 = spell;
        champ4img1.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ4Spell1"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP4IMG2") {
        champ4Spell2 = spell;
        champ4img2.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ4Spell2"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP5IMG1") {
        champ5Spell1 = spell;
        champ5img1.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ5Spell1"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else if(currentSelectedImg == "CHAMP5IMG2") {
        champ5Spell2 = spell;
        champ5img2.src = `./assets/${spell.toLowerCase()}.png`
        currentlyTiming["Champ5Spell2"] = false;
        champ5img2Time.style.opacity = "0";
        champ5img2.style.opacity = "1";
        console.log(`Changed ${currentSelectedImg} to ${spell}`)
    } else {
        console.log("Error")
    }
}

function popupSpellSelector(coords, clickedImg) {
    moveSpellSelector(coords.clientX, coords.clientY);
    spellSelector.style.visibility = "visible";
    currentSelectedImg = clickedImg;
    console.log(`Made Selector Visible for ${currentSelectedImg}`)
    return false;
}

function moveSpellSelector(x, y) {
    spellSelector.style.left = `${x}px`;
    spellSelector.style.top = `${y}px`;
    console.log(`Moved Selector (X): ${x}, (Y): ${y}`);
}

function changeSize(typ) {
    rootCS = getComputedStyle(root);
    currentSize = rootCS.getPropertyValue("--scale-factor");
    if(typ == "Increase") {
        if(currentSize < 1.5) {
            root.style.setProperty("--scale-factor", parseFloat(parseFloat(currentSize) + 0.05));
        }
    } else {
        if(currentSize > 0.5) {
            root.style.setProperty("--scale-factor", parseFloat(parseFloat(currentSize) - 0.05));
        }
    }
}

function updateCheck() {
    
}


function updateTime() {
    currentDate = new Date();
    currentTime = Math.floor(currentDate.getTime() / 1000); //This will give time in seconds since 1/1/1970 :D works perfectly for our application
}

window.setInterval(updateTime, 1000);