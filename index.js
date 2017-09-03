window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    game.initialize();
    snakeIMG = new Image();
    snakeIMG.src = "snake.png";
}

/*CODE FOR MOBILE*/
function codeMobile() {
    canvas.width = 330;
    canvas.height = 330;
    tilesize = 11;
    textsize = 20;
    
    //TODO: CREATE FOR LOOP TO HANDLE BUTTON CLICKS
    $("#left").click(function() {
        snake.changeDir("left");
        game.startTimer();
    })
    $("#up").click(function() {
        snake.changeDir("up");
        game.startTimer();
    })
    $("#right").click(function() {
        snake.changeDir("right");
        game.startTimer();
    })
    $("#down").click(function() {
        snake.changeDir("down");
        game.startTimer();
    })
    $("#spacebar").click(function() {
        game.start();
        $(this).hide();
        $(this).siblings().show();
    })
    $("#pause").click(function() {
        game.pause();
    })
}

/*CODE FOR DESKTOP*/
function codeDesktop() {
    $("#button-pad").hide();
    tilesize = 25;
    textsize = 40;
    
    $("body").keydown(function(evt) {
        switch (evt.keyCode) {
            case 37:
                snake.changeDir("left");
                game.startTimer();
                break;
            case 38:
                snake.changeDir("up");
                game.startTimer();
                break;
            case 39:
                snake.changeDir("right");
                game.startTimer();
                break;
            case 40:
                snake.changeDir("down");
                game.startTimer();
                break;
            case 32:
                game.start();
                break;
            case 27:
                game.pause();
        }
    })
}

/*CODE FOR BOTH*/
if (window.innerWidth <= 768) {
    screen = "mobile";
    codeMobile();
} else {
    screen = "desktop";
    codeDesktop();
}

//VARIABLES, ARRAYS, OBJECTS

framerate = 30;

var snake = {
    x: random(0, (canvas.width / tilesize) - 1) * tilesize,
    y: random(0, (canvas.height / tilesize) - 1) * tilesize,
    dir: ["", "left", "up", "right", "down"],
    texture: ["", 0, 25, 50, 75],
    changedDir: false,
    immune: false,
    tail: {
        array: [],
        draw: function() {
            for (i = 0; i < this.array.length - 1; i++) {
                ctx.fillStyle = "#00FF00";
                ctx.fillRect(this.array[i].x + 1, this.array[i].y + 1, tilesize - 2, tilesize - 2);
            }
            switch (this.array[this.array.length - 1].dir) {
                case "left":
                    ctx.drawImage(snakeIMG, 0, 25, 25, 25, this.array[this.array.length - 1].x, this.array[this.array.length - 1].y, tilesize, tilesize);
                    break;
                case "up":
                    ctx.drawImage(snakeIMG, 25, 25, 25, 25, this.array[this.array.length - 1].x, this.array[this.array.length - 1].y, tilesize, tilesize);
                    break;
                case "right":
                    ctx.drawImage(snakeIMG, 50, 25, 25, 25, this.array[this.array.length - 1].x, this.array[this.array.length - 1].y, tilesize, tilesize);
                    break;
                case "down":
                    ctx.drawImage(snakeIMG, 75, 25, 25, 25, this.array[this.array.length - 1].x, this.array[this.array.length - 1].y, tilesize, tilesize);
                    break;
            }
        }
    },
    move: function() {
        if (this.tail.array.length >= 1) {
            for (i = this.tail.array.length - 1; i > 0; i--) {
                this.tail.array[i].x = this.tail.array[i - 1].x;
                this.tail.array[i].y = this.tail.array[i - 1].y;
                this.tail.array[i].dir = this.tail.array[i - 1].dir;
            }
            this.tail.array[0].x = this.x;
            this.tail.array[0].y = this.y;
            this.tail.array[0].dir = this.dir[0];
        }
        switch (this.dir[0]) {
            case "left":
                this.x += -tilesize;
                break;
            case "up":
                this.y += -tilesize;
                break;
            case "right":
                this.x += tilesize;
                break;
            case "down":
                this.y += tilesize;
                break;
        }
        if (game.border.value[0] == "Teleport") {
            if (this.x < 0)
                this.x = canvas.width - tilesize;
            if (this.x >= canvas.width)
                this.x = 0;
            if (this.y < 0)
                this.y = canvas.height - tilesize;
            if (this.y >= canvas.height)
                this.y = 0;
        }
        this.changedDir = false;
        this.immune = false;
    },
    changeDir: function(direction) {
        this.direction = direction;
        if (game.running && !game.paused && !this.changedDir) {
            if (this.direction == "left" && this.dir[0] != "right") {
                this.dir[0] = "left";
                this.texture[0] = this.texture[1];
            }
            if (this.direction == "up" && this.dir[0] != "down") {
                this.dir[0] = "up";
                this.texture[0] = this.texture[2];
            }
            if (this.direction == "right" && this.dir[0] != "left") {
                this.dir[0] = "right";
                this.texture[0] = this.texture[3];
            }
            if (this.direction == "down" && this.dir[0] != "up") {
                this.dir[0] = "down";
                this.texture[0] = this.texture[4];
            }
            this.changedDir = true;
        }
    },
    eat: function() {
        if (this.x == food.x && this.y == food.y) {
            food.move();
            this.tail.array.push({x: this.x, y: this.y, texture: this.texture[0]});
            this.immune = true;
            game.calcScore();
        }
    },
    collide: function() {
        if (game.border.value[0] == "Solid") {
            if (this.x < 0 || this.x >= canvas.width || this.y < 0 || this.y >= canvas.height)
                game.restart();
        }
        for (i = 0; i < this.tail.array.length; i++) {
            if (this.x == this.tail.array[i].x && this.y == this.tail.array[i].y && !this.immune) {
                game.restart();
            }
        }
    },
    draw: function() {
        ctx.drawImage(snakeIMG, this.texture[0], 0, 25, 25, this.x, this.y, tilesize, tilesize);
    }
}

var game = {
    mode: {
        value: ["Normal", 2, "Normal", "Time Attack"],
        top: canvas.height * 0.427,
        width: canvas.width * 0.194,
        height: canvas.height * 0.054,
        left: canvas.width * 0.153,
    },
    difficulty: {
        value: ["Medium", 3, "Easy", "Medium", "Hard"],
        color: ["green", "orange", "red"],
        top: canvas.height * 0.427,
        width: canvas.width * 0.146,
        height: canvas.height * 0.054,
        left: canvas.width * 0.427,
    },
    border: {
        value: ["Solid", 2, "Solid", "Teleport"],
        color: ["red", "green"],
        top: canvas.height * 0.427,
        width: canvas.width * 0.14,
        height: canvas.height * 0.054,
        left: canvas.width * 0.68,
    },
    timer: {
        started: false,
        time: 60,
        value: 60,
        str: "1:00",
        loop: function() {
            if (game.timer.value > 0)
                game.timer.value--;
            else
                clearInterval(timerLoop);
            minutes = Math.floor(game.timer.value / 60);
            seconds = game.timer.value % 60;
            if (seconds < 10)
                seconds = "0" + seconds;
            game.timer.str = minutes + ":" + seconds;
        }
    },
    time: ["1:00", 2, "1:00", "3:00"],
    updates: 15,
    lastScore: 0,
    normalHS: 0,
    timeattackHS: 0,
    scoreMulti: 1,
    scoreByDifficulty: 15,
    running: false,
    paused: false,
    menu: {
        draw: function() {
            //White border
            ctx.fillStyle = "white";
            ctx.fillRect(canvas.width * 0.1, canvas.height * 0.2, canvas.width * 0.8, canvas.height * 0.6);
            ctx.clearRect((canvas.width * 0.1) + canvas.width * 0.015, (canvas.height * 0.2) + canvas.width * 0.015, (canvas.width * 0.8) - canvas.width * 0.03, (canvas.height * 0.6) - canvas.width * 0.03);
            //Snake and By ZivMBS
            drawText(canvas.width / 2, canvas.height * 0.25, "Snake", "#00FF00", textsize, "Calibri", "center", "middle");
            drawText(canvas.width / 2, canvas.height * 0.3, "By ZivMBS", "#00FF00", textsize * 0.65, "Calibri", "center", "middle");
            //Mode, Difficulty and Border Mode
            drawText(canvas.width * 0.25, canvas.height * 0.4, "Mode:", "white", textsize * 0.75, "Calibri", "center", "middle");
            drawText(canvas.width * 0.25, canvas.height * 0.45, game.mode.value[0], "white", textsize * 0.65, "Calibri", "center", "middle");
            drawText(canvas.width * 0.5, canvas.height * 0.4, "Difficulty:", "white", textsize * 0.75, "Calibri", "center", "middle");
            drawText(canvas.width * 0.5, canvas.height * 0.45, game.difficulty.value[0], game.difficulty.color[game.difficulty.value[1] - 2], textsize * 0.65, "Calibri", "center", "middle");
            if (game.mode.value[0] == "Normal") {
                drawText(canvas.width * 0.75, canvas.height * 0.4, "Border-Mode:", "white", textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.45, game.border.value[0], game.border.color[game.border.value[1] - 2], textsize * 0.65, "Calibri", "center", "middle");
            } else {
                drawText(canvas.width * 0.75, canvas.height * 0.4, "Time:", "white", textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.45, game.time[0], "cyan", textsize * 0.65, "Calibri", "center", "middle");
            }
            //Scores
            drawText(canvas.width / 2, canvas.height * 0.53, "Last Game Score: " + game.lastScore, "white" , textsize * 0.75, "Calibri", "center", "middle");
            if (game.mode.value[0] == "Normal")
                drawText(canvas.width / 2, canvas.height * 0.58, "Normal High Score: " + game.normalHS, "white" , textsize * 0.75, "Calibri", "center", "middle");
            else
                drawText(canvas.width / 2, canvas.height * 0.58, "Time-Attack High Score: " + game.timeattackHS, "white" , textsize * 0.75, "Calibri", "center", "middle");
            //Controls
            drawText(canvas.width / 2, canvas.height * 0.65, "Controls", "white", textsize * 0.7, "Calibri", "center", "middle");
            drawText(canvas.width / 2, canvas.height * 0.69, "Press ARROW keys to move", "white", textsize * 0.5, "Calibri", "center", "middle");
            drawText(canvas.width / 2, canvas.height * 0.72, "Press SPACE to start playing", "white", textsize * 0.5, "Calibri", "center", "middle");
            drawText(canvas.width / 2, canvas.height * 0.75, "Press ESC to pause / resume", "white", textsize * 0.5, "Calibri", "center", "middle");
        }
    },
    calcScore: function() {
        this.lastScore += this.scoreMulti * this.scoreByDifficulty;
        if (this.normalHS < this.lastScore && this.mode.value[0] == "Normal")
            this.normalHS = this.lastScore;
        if (this.timeattackHS < this.lastScore && this.mode.value[0] == "Time Attack")
            this.timeattackHS = this.lastScore;
    },
    updateHUD: function() {
        drawText(0, canvas.height - (tilesize * 0.1), "Score: " + this.lastScore, "white", textsize * 0.6, "Calibri", "left");
        if (this.mode.value[0] == "Time Attack")
        drawText(canvas.width - (tilesize * 0.1), canvas.height - (tilesize * 0.1), this.timer.str, "white", textsize * 0.6, "Calibri", "right");
    },
    saveScore: function() {
        localStorage.normalHS = JSON.stringify(this.normalHS);
        localStorage.timeattackHS = JSON.stringify(this.timeattackHS);
    },
    initialize: function() {
        if (localStorage.length != 0) {
            game.normalHS = JSON.parse(localStorage.normalHS);
            game.timeattackHS = JSON.parse(localStorage.timeattackHS);
        }
        this.menu.draw();
        snake.texture[0] = snake.texture[random(1, 4)];
        if (screen = "mobile")
            $("#spacebar").siblings().hide();
    },
    start: function() {
        if (!this.running) {
            this.lastScore = 0;
            this.update();
            gameLoop = setInterval(this.update, 1000 / this.updates);
            this.running = true;
        }
        if (this.border.value[0] == "Solid") {
            $("#canvas").css({"border-color": "red"});
        } else {
            $("#canvas").css({"border-color": "green"});
        }
    },
    startTimer: function() {
        if (this.mode.value[0] == "Time Attack" && !this.timer.started) {
            this.timer.started = true;
            timerLoop = setInterval(this.timer.loop, 1000);
        }
    },
    restart: function() {
        game.saveScore();
        if (screen = "mobile") {
            $("#spacebar").show();
            $("#spacebar").siblings().hide();
        }
        $("#canvas").css({"border-color": "white"});
        if (game.mode.value[0] == "Time Attack")
        	clearInterval(timerLoop);
        clearInterval(gameLoop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.running = false;
        this.paused = false;
        game.timer.value = game.timer.time;
        snake.tail.array = [];
        snake.x = random(0, (canvas.width / tilesize) - 1) * tilesize;
        snake.y = random(0, (canvas.height / tilesize) - 1) * tilesize;
        snake.dir[0] = "";
        snake.texture[0] = snake.texture[random(1, 4)];
        food.x = random(0, (canvas.width / tilesize) - 1) * tilesize;
        food.y = random(0, (canvas.height / tilesize) - 1) * tilesize;
        this.menu.draw();
    },
    pause: function() {
        if (this.running && !this.paused) {
            if (game.mode.value[0] == "Time Attack")
            	clearInterval(timerLoop);
            clearInterval(gameLoop);
            this.paused = true;
        } else if (this.running && this.paused) {
            gameLoop = setInterval(this.update, 1000 / this.updates);
            timerLoop = setInterval(this.timer.loop, 1000);
            this.paused = false;
        }
    },
    update: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.updateHUD();
        snake.move();
        snake.eat();
        if (snake.tail.array.length > 0)
            snake.tail.draw();
        food.draw();
        snake.draw();
        snake.collide();
    }
}

var food = {
    x: random(0, (canvas.width / tilesize) - 1) * tilesize,
    y: random(0, (canvas.height / tilesize) - 1) * tilesize,
    move: function() {
        food.x = random(0, (canvas.width / tilesize) - 1) * tilesize;
        food.y = random(0, (canvas.height / tilesize) - 1) * tilesize;
    	for (i = 0; i < snake.tail.array.length - 1; i++) {
    		if (food.x == snake.x && food.y == snake.y) {
                this.move();
    		}
            if (food.x == snake.tail.array[i].x && food.y == snake.tail.array[i].y) {
                this.move();
            }
        }
    },
    draw: function() {
        ctx.fillStyle = "#FF00AB";
        ctx.fillRect(this.x + 1, this.y + 1, tilesize - 2, tilesize - 2);
        ctx.fillStyle = "black";
    }
}

//FUNCTIONS

function drawText(x, y, text, color, size, font, align, baseline) {
    if (color == undefined || color == "")
        color = "black";
    if (size == undefined || size == "")
        size = 10;
    if (font == undefined || font == "")
        font = "Arial";
    if (align == undefined || align == "")
        align = "start";
    if (baseline == undefined || baseline == "")
        baseline = "alphabetic";
    size = JSON.stringify(size);
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.font = size + "px " + font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    //defaults the style.
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
}

function getMousePos(evt) {
var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function handleSettings(setting) {
    if (setting == "mode") {
        switch (game.mode.value[0]) {
            case "Normal":
                ctx.clearRect(canvas.width * 0.25, canvas.height * 0.55, canvas.width * 0.50, canvas.height * 0.06);
                ctx.clearRect(canvas.width * 0.616, canvas.height * 0.373, canvas.width * 0.266, canvas.height * 0.113);
                drawText(canvas.width / 2, canvas.height * 0.58, "Normal High Score: " + game.normalHS, "white" , textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.4, "Border-Mode:", "white", textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.45, game.border.value[0], game.border.color[game.border.value[1] - 2], textsize * 0.65, "Calibri", "center", "middle");
                break;
            case "Time Attack":
                ctx.clearRect(canvas.width * 0.25, canvas.height * 0.55, canvas.width * 0.50, canvas.height * 0.06);
                ctx.clearRect(canvas.width * 0.616, canvas.height * 0.373, canvas.width * 0.266, canvas.height * 0.113);
                drawText(canvas.width / 2, canvas.height * 0.58, "Time-Attack High Score: " + game.timeattackHS, "white" , textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.4, "Time:", "white", textsize * 0.75, "Calibri", "center", "middle");
                drawText(canvas.width * 0.75, canvas.height * 0.45, game.time[0], "cyan", textsize * 0.65, "Calibri", "center", "middle");
                game.scoreMulti = 0.8;
                game.border.value[0] = "Teleport";
                game.border.value[1] = 3;
                break;
        }
    }
    if (setting == "difficulty") {
        switch (game.difficulty.value[0]) {
            case "Easy":
                game.updates = 10;
                game.scoreByDifficulty = 10;
                break;
            case "Medium":
                game.updates = 15;
                game.scoreByDifficulty = 15;
                break;
            case "Hard":
                game.updates = 20;
                game.scoreByDifficulty = 20;
                break;
        }
    }
    if (setting == "border") {
        switch (game.border.value[0]) {
            case "Solid":
                game.scoreMulti = 1;
                break;
            case "Teleport":
                game.scoreMulti = 0.8;
        }
    }
    if (setting == "time") {
        switch (game.time[0]) {
            case "1:00":
                game.timer.time = 60;
                game.timer.value = 60;
                game.timer.str = "1:00";
                break;
            case "3:00":
                game.timer.time = 180;
                game.timer.value = 180;
                game.timer.str = "3:00";
                break;
        }
    }
}

$("#canvas").on({
    mousemove: function(evt) {
        mousePos = getMousePos(evt);
    },
    mousedown: function(evt) {
        mousePos = getMousePos(evt);
        if (!game.running) {
            //DETECTS BUTTON CLICKS AND CHANGES VALUES
            //MODE
            if (mousePos.x >= game.mode.left && mousePos.x <= game.mode.left + game.mode.width &&
                mousePos.y >= game.mode.top && mousePos.y <= game.mode.top + game.mode.height) {
                if (game.mode.value[1] >= 3) {
                    game.mode.value[1] = 2;
                } else {
                    game.mode.value[1]++;
                }
                game.mode.value[0] = game.mode.value[game.mode.value[1]];
                ctx.clearRect(game.mode.left, game.mode.top, game.mode.width, game.mode.height);
                drawText(canvas.width * 0.25, canvas.height * 0.45, game.mode.value[0], "white", textsize * 0.65, "Calibri", "center", "middle");
                handleSettings("mode");
            }
            //DIFFICULTY
            if (mousePos.x >= game.difficulty.left && mousePos.x <= game.difficulty.left + game.difficulty.width &&
                mousePos.y >= game.difficulty.top && mousePos.y <= game.difficulty.top + game.difficulty.height) {
                if (game.difficulty.value[1] >= 4) {
                    game.difficulty.value[1] = 2;
                } else {
                    game.difficulty.value[1]++;
                }
                game.difficulty.value[0] = game.difficulty.value[game.difficulty.value[1]];
                ctx.clearRect(game.difficulty.left, game.difficulty.top, game.difficulty.width, game.difficulty.height);
                drawText(canvas.width * 0.5, canvas.height * 0.45, game.difficulty.value[0], game.difficulty.color[game.difficulty.value[1] - 2], textsize * 0.65, "Calibri", "center", "middle");
                handleSettings("difficulty");
            }
            //BORDER MODE / TIME
            if (mousePos.x >= game.border.left && mousePos.x <= game.border.left + game.border.width &&
                mousePos.y >= game.border.top && mousePos.y <= game.border.top + game.border.height) {
                if (game.mode.value[0] == "Normal") {//BORDER MODE
                    if (game.border.value[1] >= 3) {
                        game.border.value[1] = 2;
                    } else {
                        game.border.value[1]++;
                    }
                    game.border.value[0] = game.border.value[game.border.value[1]];
                    ctx.clearRect(game.border.left, game.border.top, game.border.width, game.border.height);
                    drawText(canvas.width * 0.75, canvas.height * 0.45, game.border.value[0], game.border.color[game.border.value[1] - 2], textsize * 0.65, "Calibri", "center", "middle");
                    handleSettings("border");
                } else {//TIME
                    if (game.time[1] >= 3) {
                        game.time[1] = 2;
                    } else {
                        game.time[1]++;
                    }
                    game.time[0] = game.time[game.time[1]];
                    ctx.clearRect(game.border.left, game.border.top, game.border.width, game.border.height);
                    drawText(canvas.width * 0.75, canvas.height * 0.45, game.time[0], "cyan", textsize * 0.65, "Calibri", "center", "middle");
                    handleSettings("time");
                }
            }
        }
    }
})

/*
TODO:
Add GamePad for Landscape mode on Mobile
Remove Pause + Timer exploit
*/