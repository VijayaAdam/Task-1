const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const timeElement = document.querySelector(".timer");
const controls = document.querySelectorAll(".controls i");

let fX, fY, sX = 5, sY = 10;
let vX = 0, vY =0;
let snakeBody = []; 
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const start = 3;
let time = start * 60;

const changeFoodPosition = () =>{
    fX = Math.floor(Math.random() * 30)+1;
    fY = Math.floor(Math.random() * 30)+1;    
}

const changeDirection = (a) => {
    if(a.key === "ArrowUp" && vY != 1){
        vX = 0;
        vY = -1;
    }
    else if(a.key === "ArrowDown" && vY != -1){
        vX = 0;
        vY = 1;
    }
    else if(a.key === "ArrowLeft" && vX != 1){
        vX = -1;
        vY = 0;
    }
    else if(a.key === "ArrowRight" && vX != -1){
        vX = 1;
        vY = 0;
    }
    
}

controls.forEach(key=> {
    key.addEventListener("click",() => changeDirection({key: key.dataset.key}));
})

function updateTimer() {
    const minutes = Math.floor(time/60);
    let seconds =  time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timeElement.innerText = `Timer: ${minutes}:${seconds}`;
    time--;
    if(time==0){gameOver=true;}
    if(time>(start*60)){time=start*60;}
}

const initGame = () => {
    
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${fY} / ${fX}"></div>`;
    
    if(sX === fX && sY === fY){
        changeFoodPosition();
        snakeBody.push([fX, fY]);
        score++;
        time+=5;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score",highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `HighScore: ${highScore}`;
    }

    for(let i = snakeBody.length-1 ; i>0 ; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [sX, sY];

    sX += vX;
    sY += vY;
    
    if(sX<=0 || sX>30 || sY<=0 || sY>30){
        gameOver = true;
    }

    for(let i=0 ; i < snakeBody.length; i++){
        htmlMarkup+=`<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
            gameOver =true;
        }
    }
   
    playBoard.innerHTML = htmlMarkup;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    clearInterval(settimeInterval);
    alert("Game Over ! Press Ok to replay...");
    location.reload();
}

updateTimer();
changeFoodPosition();
setIntervalId = setInterval(initGame, 130);
let settimeInterval = setInterval(updateTimer, 1000);
document.addEventListener("keydown",changeDirection);