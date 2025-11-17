// listeners
document.addEventListener('keydown', keyPush);

// canvas
const canvas = document.querySelector("canvas");
const title = document.querySelector("h1");
const context = canvas.getContext("2d");

// GAME or GAME OVER
let gameRunning = true;

// score
const fps = 15;
const tileSize = 30;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;   
let score = 0;

// player
let snakeSpeed = tileSize;
let snakePosX = 0;
let snakePosY = canvas.height/2;

let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 1;

// food
let foodPosX = 0;
let foodPosY = 0;

// loop game
function gameLoop() {
    if (gameRunning) {
        drawThing();
        moveSnake();
        setTimeout(gameLoop, 1000 / fps);
    }
}
resetFood();
gameLoop();

/* Move snake */
function moveSnake() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    // wall collision
    if (snakePosX > canvas.width -tileSize) {
        snakePosX = 0;
    }
    if (snakePosX < 0) {
        snakePosX = canvas.width;
    } 
    if (snakePosY > canvas.height - tileSize) {
        snakePosY = 0;
    }
    if (snakePosY < 0) {
        snakePosY = canvas.height;
    }

    // hit snake body means GAME OVER
    tail.forEach( snakePart => {
        if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
            gameOver();
        }
    })

    // tail
    tail.push({ x: snakePosX, y: snakePosY});
    
    // forget earliest parts of snake tail
    tail = tail.slice(-1 * snakeLength);

    // food colision
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        title.textContent = ++score;
        snakeLength++;
        resetFood();                
    }
}

/* Draw snake, field,... */
function drawThing() {
    // background
    rectangle("#c93cbb", 0, 0, canvas.width, canvas.height);

    // draw grid
    drawGrid();

    // food
    rectangle("#75aceb", foodPosX, foodPosY, tileSize - 1, tileSize - 1);

    tail.forEach((snakePart) =>
        rectangle("#555", snakePart.x, snakePart.y, tileSize, tileSize)
    );

    // black snake's head
    rectangle("black", snakePosX, snakePosY, tileSize, tileSize);
}

// create rectangle
function rectangle(color, x, y, width, height) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// reset food
function resetFood() {
    //The End nowhere to go
    if (snakeLength === tileCountX * tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    // dont spawn food on snake head
    if (foodPosX === snakePosX && foodPosY === snakePosY) {
        resetFood();
    }

    // dont spawn food on snake tail
    if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetFood();
    }
}

// GAME OVER
// function keyPush restart game in section default
function gameOver() {
    title.innerHTML = `<strong> ${score} </strong> <h2>Game Over</h2>`;
    gameRunning = false;
}

/* Keyboard 0, 1, -1*/
function keyPush(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (velocityX !== 1) {    
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) {   
                velocityX = 0;
                velocityY = 1;
            }
            break;
        default:
            // restart game
            if (! gameRunning) location.reload();
            break;
    }
}

// function grid
function drawGrid() {    
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                "#6fdd2f",
                tileSize * i,
                tileSize * j,
                tileSize - 1,
                tileSize - 1
            );                
        }    
    }
}
