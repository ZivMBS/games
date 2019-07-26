const text = document.getElementById("text");
const input = document.getElementById("input");
const timer = document.getElementById("timer");
const timerBar = document.getElementById("timer-bar");
const score = document.getElementById("score");

const MAX_TIME = 60;
let time = 60;
let completed = [];
let started = false;

text.innerText = words();

input.addEventListener("input", (evt) => {
    let length = input.value.length;
    if (!started) {
        updateTime();
        started = true;
    }
    if (text.innerText.startsWith(input.value)) {
        text.innerHTML = `<span class="correct">${input.value}</span>${text.innerText.substr(length)}`;
    }
});
input.addEventListener("keydown", (evt) => {
    if (evt.keyCode == 13 && time > 0)
        checkWord();
})
input.focus();

function checkWord() {
    let word = text.innerText;
    if (input.value == word) {
        completed.push(text.innerText);
        wordList.splice(wordList.indexOf(text.innerText), 1);
        score.innerText = completed.length;
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

    stats[1].innerText = `Average word length: ${roundToDecimalPlace(totalLength/completed.length, 3)}`;
    stats[2].innerText = `Longest word: ${longestWord} (${longestWordSTR})`
    stats[3].innerText = `Words per second: ${roundToDecimalPlace(completed.length/MAX_TIME, 3)}`
    stats[4].innerText = `Letters per second: ${roundToDecimalPlace(totalLength/MAX_TIME, 3)}`
}




showTime()
function updateTime() {
    time--;
    showTime()
    if (time > 0)
        setTimeout(updateTime, 1000);
    else
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