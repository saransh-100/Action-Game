let score = 0;
let cross = true;
let gameOverFlag = false;
let obstacleSpeed = 7;

audio = new Audio('assets/music.mp3');
audioOver = new Audio('assets/gameover.mp3');

setTimeout(() => {
    audio.play();
}, 1000);

document.onkeydown = function(e){
    let dino = document.querySelector('.dino');
    let dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue('left'));

    if(e.keyCode == 38){
        dino.classList.add('jump');
        setTimeout(() => {
            dino.classList.remove('jump');
        }, 700);
    } else if(e.keyCode == 39){
        dino.style.left = (dinoLeft + 100) + "px";
    } else if(e.keyCode == 37){
        dino.style.left = (dinoLeft - 100) + "px";
    }
}

function moveObstacle(){ 
    let obstacle = document.querySelector(".obstacle");
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

    if (obstacleLeft <= -50) {
        obstacle.style.left = "100vw";
    } else {
        obstacle.style.left = obstacleLeft - obstacleSpeed + "px";
    }
}

let moveObstacleInterval = setInterval(moveObstacle, 25);

document.addEventListener("DOMContentLoaded", () => {
    let storedHighScore = localStorage.getItem("highScore");
    let highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    document.querySelector("#score").innerHTML = `Your Score: ${score}`;
    document.querySelector("#high-score").innerHTML = `High Score: ${highScore}`;
    document.querySelector("#score").style.display = "block";
});

let checkCollisionInterval = setInterval(() => {
   let dino = document.querySelector('.dino');
   let gameOverText = document.querySelector('.game-over span');
   let restartButton = document.querySelector('.restart-button');
   let obstacle = document.querySelector('.obstacle');
   let highScoreElement = document.querySelector('#high-score');
   
   let dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue('left'));
   let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
   let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
   let obstacleBottom = parseInt(window.getComputedStyle(obstacle).getPropertyValue('bottom'));
   let offsetX = Math.abs(dinoLeft - obstacleLeft);
   let offsetY = Math.abs(dinoBottom - obstacleBottom);

   if(!gameOverFlag && offsetX < 160 && offsetY < 100){
        handleGameOver(gameOverText, restartButton);
   } else if(!gameOverFlag && offsetX < 140 && cross){
        updateScore();
        increaseSpeed();
   }
}, 10);

function handleGameOver(gameOverText, restartButton) {
    gameOverText.innerHTML = 'Game Over';
    restartButton.style.display = 'block';
    audioOver.play();

    setTimeout(() => {
        audioOver.pause();
        audio.pause();
    }, 1000);

    document.onkeydown = null;
    document.querySelector('.obstacle').style.animation = 'none';
    
    clearInterval(moveObstacleInterval);
    clearInterval(checkCollisionInterval);
    gameOverFlag = true;

    document.querySelector('#score').innerHTML = `Your Score: ${score}`;
    document.querySelector('#score').style.display = 'block';
}

function updateScore() {
    score += 1;
    document.querySelector('#score').innerHTML = `Your Score: ${score}`;
    let storedHighScore = localStorage.getItem('highScore');
    let highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    if(score > highScore){
        updateHighScore(score);
    }
    cross = false;
    setTimeout(() => {
        cross = true;
    }, 500);
}

function updateHighScore(score) {
    localStorage.setItem('highScore', score);
    let highScoreElement = document.querySelector('#high-score');
    if (highScoreElement) {
        highScoreElement.innerHTML = `High Score: ${score}`;
    } else {
        console.error("High score element not found!");
    }
}

function increaseSpeed() {
    setTimeout(() => {
        obstacleSpeed += 0.5;
        if (obstacleSpeed > 15) {
            obstacleSpeed = 15;
        }
    }, 500);
}

document.querySelector('.restart-button').addEventListener('click', () => {
    window.location.reload();
});
