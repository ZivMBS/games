const text = document.getElementById("text");
const input = document.getElementById("input");
const timer = document.getElementById("timer");
const timerBar = document.getElementById("timer-bar");
const score = document.getElementById("score");

const MAX_TIME = 60;
let time = 60;
let completed = [];
let started = false;

reset();
input.addEventListener("input", () => {
    let length = input.value.length;
    if (!started) {
        started = true;
        updateTime();
    }
    input.value = input.value.toLocaleLowerCase();
    if (text.innerText.startsWith(input.value)) {
        text.innerHTML = `<span class="correct">${input.value}</span>${text.innerText.substr(length)}`;
    } else {
        let differenceSpot = compareStrings(text.innerText, input.value);
        text.innerHTML = `<span class="correct">${text.innerText.substr(0, differenceSpot)}</span><span class="incorrect">${text.innerText.substr(differenceSpot, text.innerText.length-differenceSpot)}</span>`
    }
});
input.addEventListener("keydown", (evt) => {
    if (time > 0 && evt.keyCode == 13)
        checkWord();
    if (evt.shiftKey && evt.keyCode == 82) {
        evt.preventDefault();
        reset();
    }
});

function checkWord() {
    let word = text.innerText;
    if (input.value == word) {
        completed.push(text.innerText);
        wordList.splice(wordList.indexOf(text.innerText), 1);
        score.innerText = `Score: ${completed.length}`;
        input.value = "";
        text.innerText = words();
    }
}

function statistics() {
    let totalLength = 0;
    let longestWord = 0;
    let longestWordSTR = "";
    for (let word of completed) {
        totalLength += word.length;
        if (word.length > longestWord) {
            longestWord = word.length;
            longestWordSTR = word;
        }
    }
    let stats = document.getElementsByClassName("stat");
    stats[2].innerText = `Average word length: ${roundToDecimalPlace(totalLength/completed.length, 3)}`;
    stats[3].innerText = `Longest word: ${longestWord} (${longestWordSTR})`
    stats[4].innerText = `Words per second: ${roundToDecimalPlace(completed.length/MAX_TIME, 3)}`
    stats[5].innerText = `Letters per second: ${roundToDecimalPlace(totalLength/MAX_TIME, 3)}`
}

function reset() {
    for (let word of completed) {
        wordList.push(word);
    }
    completed = [];
    time = MAX_TIME;
    started = false;
    text.innerText = words();
    input.value = "";
    input.focus();
    showTime();
}

showTime()
function updateTime() {
    if (time > 0 && started) {
        time--;
        showTime()
        setTimeout(updateTime, 1000);
    } else
        statistics();
}

function showTime() {
    timer.innerText = `${Math.floor(time/60)}:${time%60<10?"0":""}${time % 60}`;
    timerBar.style.clipPath = `inset(0 ${(100/MAX_TIME)*(MAX_TIME-time)}% 0 0)`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function roundToDecimalPlace(int, digitsAfterPoint = 2) {
    return Math.round(int*10**digitsAfterPoint)/10**digitsAfterPoint;
}

function compareStrings(str1, str2) {
    let shorter = Math.min(str1.length, str2.length);
    for (let i = 0; i < shorter; i++) {
        if (str1[i] != str2[i])
            return i;
    }
}