// Selecting Elements
const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");

// Modals
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

// Score and Time Displays
const highScoreDisplay = document.querySelector("#high-score");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
// Game Variables
const blockheight=20;
const blockwidth=20;
// Scores and Time
let highScore=localStorage.getItem("highScore") || 0;
let score=0;
let time=`00:00`;

highScoreDisplay.innerText=highScore;

// Board Setup
const cols=Math.floor(board.clientWidth/blockwidth);
const rows=Math.floor(board.clientHeight/blockheight);

// Game State Variables
let intervalId=null;
let timerIntervalId=null;
let food= {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};

// Creating Blocks
const blocks=[];

// Snake Initial Position
let snake=[{x:1,y:3}];

// Initial Direction
let direction="right";

// Create Board Blocks

 for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        //block.innerText=`${row}-${col}`;
        blocks[`${row}-${col}`]=block;
    }
}

// render function
function render(){
    let head= null;
    blocks[`${food.x}-${food.y}`].classList.add("food");
// head update logic
    if(direction==="left"){
        head={x:snake[0].x,y:snake[0].y-1};
    }else if(direction==="right"){
        head={x:snake[0].x,y:snake[0].y+1};
    }else if(direction==="up"){
        head={x:snake[0].x-1,y:snake[0].y};
    }else if(direction==="down"){
        head={x:snake[0].x+1,y:snake[0].y};
    }

    // wall collision logic
    if (head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        modal.style.display="flex";
        startGameModal.style.display="none";
        gameOverModal.style.display="flex";
        return;
    }

    // food consume logic
    if(head.x===food.x && head.y===food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
// add new head to snake
        snake.unshift(head);
// update score
        score+=10;
        scoreDisplay.innerText=score;
        if(score>highScore){
            highScore=score;
            highScoreDisplay.innerText=highScore;
            localStorage.setItem("highScore",highScore.toString());
        }
    }
// normal movement logic
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
// add new head and remove tail
    snake.unshift(head);
    snake.pop();
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}
 

// Start Button Event Listener
startButton.addEventListener("click", () => {
    modal.style.display="none";
    // Game Interval
    intervalId = setInterval(() => {
        render();
    }, 300);
    // Timer Interval
    timerIntervalId=setInterval(()=>{
        let [mins,secs]=time.split(":").map(Number);
        
        if(secs===59){
            mins+=1;
            secs=0;
        }else{
            secs+=1;
        }
        time=`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
        timeDisplay.innerText=time;
    },1000);
});

// Restart Button Event Listener
restartButton.addEventListener("click", () => {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    modal.style.display="none";
    direction="right";
    snake=[{x:1,y:3}];
    score=0;
    scoreDisplay.innerText=score;
    highScoreDisplay.innerText=highScore;
    time=`00:00`;
    timeDisplay.innerText=time;
    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    intervalId = setInterval(() => {
        render();
    }, 300);
});


// Keyboard Event Listener
addEventListener("keydown",(event)=>{
    if(event.key==="ArrowLeft"){
        direction="left";
    }else if(event.key==="ArrowRight"){
        direction="right";
    }else if(event.key==="ArrowUp"){
        direction="up";
    }else if(event.key==="ArrowDown"){
        direction="down";
    }
});