// emojis
const emos = {
    "undefined": "\u{274C}",
    "poop": "\u{1F4A9}",
    "fire": "\u{1F525}",
    "sunglasses": "\u{1F576}",
    "equality": "\u{2694}",
    "crossed-swords": "\u{2694}",
    "crossbones": "\u{2620}",
    "tongue": "\u{1F445}",
    "facepalm": "\u{1F926}",
    "clown": "\u{1F921}",
    "detective": "\u{1F575}",
    "rainbow": "\u{1F308}"
};

function getEmoji(name){
    if(!emos.hasOwnProperty(name)){
        name = "undefined";
    } 
    return emos[name];
}

const winningEmos = [getEmoji("fire"), getEmoji("sunglasses"), 
getEmoji("rainbow")];
const losingEmos = [getEmoji("poop"), getEmoji("tongue"), 
getEmoji("facepalm"), getEmoji("clown")];
const drawEmos = [getEmoji("equality"), getEmoji("detective")];

// images to listen to click an hover event
const rock_img = document.getElementById("rock");
const paper_img = document.getElementById("paper");
const scissors_img = document.getElementById("scissors");
const buttons = [paper_img, rock_img, scissors_img];

// reset button
const reset_button = document.getElementById("button-reset");

// output results and scores into elements ...
const compScore_span = document.getElementById("comp-score");
const userScore_span = document.getElementById("user-score");
const result_p = document.getElementById("result-label");
const action_p = document.getElementById("action-message");
const userChoice_img = document.getElementById("last-userChoice");
const compChoice_img = document.getElementById("last-compChoice");
const userStreak_span = document.getElementById("user-streak");
const compStreak_span = document.getElementById("comp-streak");

// game related stuff
const border_color_class = {"-1": "lost", "0": "draw", "1": "win"};
const options = ["paper", "rock", "scissors"];
const optCount = options.length;
const actives = ["covers", "breaks", "cuts"];
const passives = ["is cut by", "is covered by", "is broken by"];
let userScore = 0;
let compScore = 0;
let userStreak = 0;
let compStreak = 0;
let lastSuccess = undefined;

// default messages
const action_default = action_p.innerHTML;
const result_default = result_p.innerHTML;

// default last choices src
const userChoice_img_default = userChoice_img.getAttribute("src");
const compChoice_img_default = compChoice_img.getAttribute("src");

//fucntions
function getRandomItem(array){
    return array[Math.floor(Math.random() * array.length)];
}


function getComputerChoice() {
    return Math.floor(Math.random() * options.length);
}

function applySuccessToBorders(success, userChoice){
    if(lastSuccess != success){
        if(lastSuccess != undefined){
            userChoice_img.classList.remove(border_color_class[lastSuccess])
            compChoice_img.classList.remove(border_color_class[-lastSuccess]);
        }
        lastSuccess = success;
        if(success != undefined){
            userChoice_img.classList.add(border_color_class[success]);
            compChoice_img.classList.add(border_color_class[-success]);
        }
    }
    
    if(success != undefined && userChoice != undefined){
        buttons[userChoice].classList.add(border_color_class[success]);
        setTimeout(function() {
            buttons[userChoice].classList.remove(border_color_class[success]);
        }, 500);
    }
}

function applyStreaks(){
    userSt = "";
    compSt = "";
    
    if(userStreak > 0){
        for(var i = 0; i < userStreak; i++){
            userSt += getEmoji("fire");
        }
    } else if (compStreak > 0) {
        for(var i = 0; i < compStreak; i++){
            compSt += getEmoji("fire");
        }
    }

    compStreak_span.innerHTML = compSt;
    userStreak_span.innerHTML = userSt;
}

function progress(userChoice){
    const compChoice = getComputerChoice();
    let result;
    let success;
    if(userChoice === compChoice){
        // draw
        result = "Both players picked " + options[userChoice] + ". It's a DRAW! " + getRandomItem(drawEmos);
        success = 0;
    } else if((userChoice + 1) % optCount === compChoice) {
        // user wins
        userScore++;
        userStreak++;
        compStreak = 0;
        result = "Your " + options[userChoice] + " " + actives[userChoice] +
                 " the Computer's " + options[compChoice] + ". You WIN! " + getRandomItem(winningEmos);
        success = 1;
    } else {
        // user loses
        compScore++;
        compStreak++;
        userStreak = 0;
        result = "Your " + options[userChoice] + " " + passives[userChoice] +
                 " the Computer's " + options[compChoice] + ". You LOSE! " + getRandomItem(losingEmos);
        success = -1;
    }

    // show result and actualize scores
    result_p.innerHTML = result;
    compScore_span.innerHTML = compScore;
    userScore_span.innerHTML = userScore;
    applyStreaks();

    // show picked choices
    userChoice_img.setAttribute("src", buttons[userChoice].getAttribute("src"));
    compChoice_img.setAttribute("src", buttons[compChoice].getAttribute("src"));

    // border according to success
    applySuccessToBorders(success, userChoice);
}


function suggest(choice) {
    action_p.innerHTML = "Click to play " + options[choice] + "!";
}

// initialize event listeners
for(var i = 0; i < optCount; i++){
    let index = i;
    buttons[i].addEventListener("click", function() {
        progress(index);
    });

    buttons[i].addEventListener("mouseenter", function () {
        suggest(index);
    });

    buttons[i].addEventListener("mouseleave", function () {
        action_p.innerHTML = action_default;
    });

    buttons[i].addEventListener("touchend", function (eve) {
        eve.preventDefault();
        progress(index);
    });
}

reset_button.onclick = function () {
    compScore = 0;
    userScore = 0;
    userStreak = 0;
    compStreak = 0;

    action_p.innerHTML = action_default;
    result_p.innerHTML = result_default;
    compScore_span.innerHTML = compScore;
    userScore_span.innerHTML = userScore;

    userChoice_img.setAttribute("src", userChoice_img_default);
    compChoice_img.setAttribute("src", compChoice_img_default);

    applyStreaks();
    applySuccessToBorders(undefined, undefined);
}