const canvas = document.querySelector("#canvas");
const message = document.querySelector("#message");
const ctx = canvas.getContext("2d");
//console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
message.style.display = "none";

let BLOCK_WIDTH = 35;
let resize = false;
let balls = [];

class Board {
    constructor() {
        this.x = 0 + Player1.width + 5;
        this.y = 5;
        this.width = canvas.width - Player1.width * 2 - 10;
        this.height = canvas.height - 15;
        this.backgroundColor = "#363636";
        this.color = "#000";
        this.gameRunning = false;
        this.needToResetBoard = true;
    }

    updateSize() {
        this.width = canvas.width - Player1.width * 2 - 10;
        this.height = canvas.height - 15;
    }

    checkWidthAndHeight() {
        this.width = Math.floor(this.width /BLOCK_WIDTH ) * BLOCK_WIDTH;
        this.height = Math.floor(this.height / BLOCK_WIDTH) * BLOCK_WIDTH;
    }

    draw() {
        if (!this.gameRunning && resize) {
            this.updateSize();
            this.checkWidthAndHeight();
            this.needToResetBoard = true;

            resize = false;
        }

        ctx.beginPath();
        ctx.fillStyle = this.backgroundColor;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.stroke();
    }
}

class Ball {
    constructor(x, y, xSpeed, ySpeed, color) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.color = color;
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.x < PlayBoard.x || this.x > PlayBoard.x + PlayBoard.width) {
            this.xSpeed *= -1;
        }
        if (this.y < PlayBoard.y || this.y > PlayBoard.y + PlayBoard.height) {
            this.ySpeed *= -1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
    }
}

window.addEventListener("resize", (e) => {
    resize = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        canvas.style.display = "none";
        message.style.display = "block";
    } else {
        canvas.style.display = "block";
        message.style.display = "none";
    }
});

class Player {
    constructor() {
        this.width = 250;
        this.height = 300;
        this.opacity = 1;
        this.backgroundColor = "#363636";
        this.shooterColor = "black";
        this.x = 0;
        this.xShooterSymbol = 1;
        this.yShooterSymbol = 1;
        this.y = 0;
        this.exit = false;
        this.degrees = 90;
        this.progression = 1;
        this.maxDegreesChange = 90;
        this.startPosition = 0;
        this.numShots = 1;
        this.fire = false;
        this.last = 0;
        this.numBlocks = 0;
        this.canPlay = true;
    }

    eliminate() {
        this.canPlay = false;
    }

    shoot() {

        if (this.numShots > 0) {
            this.numShots -= 1;
            if (this.numShots === 0) {
                this.fire = false;
            }
            let shot = new Ball(this.lineToX, this.lineToY, calculateWidth(60, this.degrees)/22, calculateHeight(60, this.degrees)/22, this.shooterColor);
            balls.push(shot);
        }
    }

    drawShooter() {
        let xCoord =
            this.x === 0
                ? PlayBoard.x + 10
                : PlayBoard.x + PlayBoard.width - 10;

        let yCoord =
            this.y === 0
                ? PlayBoard.y + 10
                : PlayBoard.y + PlayBoard.height - 10;
        //draw a rect with an angle
        ctx.beginPath();
        ctx.fillStyle = this.shooterColor;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;
        ctx.moveTo(xCoord, yCoord);
        this.lineToX = xCoord + calculateWidth(60, this.degrees);
        this.lineToY = yCoord + calculateHeight(60, this.degrees);
        ctx.lineTo(
            this.lineToX,
            this.lineToY
        );
        ctx.fill();
        this.degrees += this.progression;
        if (
            this.degrees === this.maxDegreesChange ||
            this.degrees === this.startPosition
        ) {
            this.progression *= -1;
        }

        ctx.stroke();
    }

    randomizeShots = () => {
        if (!this.fire) {
            if (this.numShots === 0) {
                this.numShots = 1;
            }
    
            let x = Math.floor( Math.random() * 3);
            if ( x === 0) {
                this.numShots *= 4;
            } else if (x === 2) {
                this.numShots +=2;
            } else {
                this.fire = true;
            }
        }
        
    
        
    }

    setPlayer = (count) => {
        if (count === 1) {
            this.x = 0;
            this.y = 0;
            this.shooterColor = "green";
            this.startPosition = 89.5;
            this.degrees = 89.5;
           
            this.maxDegreesChange = 0.5;
            this.progression = -1;
        }
        if (count === 2) {
            this.x = canvas.width - this.width;
            this.y = 0;
            this.shooterColor = "red";
            this.startPosition = -179.5;
            this.degrees = -179.5;
           
            this.maxDegreesChange = -269.5;
            this.progression = -1;
        }
        if (count === 3) {
            this.x = 0;
            this.y = canvas.height - this.height;
            this.shooterColor = "yellow";
            this.startPosition = -0.5;
            this.degrees = -0.5;
           
            this.maxDegreesChange = -89.5;
            this.progression = -1;
        }
        if (count === 4) {
            this.x = canvas.width - this.width;
            this.y = canvas.height - this.height;
            this.shooterColor = "purple";
            this.startPosition = -89.5;
            this.degrees = -89.5;
           
            this.maxDegreesChange = -179.5;
            this.progression = -1;
        }
    };
}

function rnd(min, max) {
    return Math.floor(Math.random() * max) + min;
}

class Block {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = BLOCK_WIDTH;
        this.height = BLOCK_WIDTH;
    }

    testHit(color, ballX, ballY) {

        //if the colors are the same, ignore colision
        if (
            (ballX+2.5 >= this.x &&
            ballX+2.5 <= this.x + this.width) &&
            (ballY+2.5 >= this.y &&
            ballY+2.5 <= this.y + this.height)
        ) {
            if (color === this.color) {
                return {inBox: true, differentColor: false};
            }
            
            let oldColor = this.color;
            this.color = color;
            players.forEach((x) => {
                if (oldColor === x.shooterColor) {
                    x.numBlocks -= 1;
                }
                if (color === x.shooterColor) {
                    x.numBlocks += 1;
                }
                if (x.numBlocks === 0) {
                    x.eliminate();
                }
            })
            
            return {inBox: true, differentColor: true};
        }
        return {inBox: false, differentColor: false};
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.rect(this.x, this.y, BLOCK_WIDTH, BLOCK_WIDTH);
        ctx.fill();

        ctx.stroke();
    }
}


const Player1 = new Player();
Player1.setPlayer(1);

const Player2 = new Player();
Player2.setPlayer(2);

const Player3 = new Player();
Player3.setPlayer(3);

const Player4 = new Player();
Player4.setPlayer(4);

const players = [Player1, Player2, Player3, Player4];

const PlayBoard = new Board();
PlayBoard.checkWidthAndHeight();

let blocks = [];


function calculateNumOfBlocks() {
    players.forEach((x) => {
        x.canPlay = true;
        x.numBlocks = 0;
    })
    blocks = [];
    let width = PlayBoard.width / BLOCK_WIDTH;
    let height = PlayBoard.height / BLOCK_WIDTH;
    let totalAmount = width * height;

    let blockX = PlayBoard.x;
    let blockY = PlayBoard.y;
    let tempBlock;
    for (let x = 0; x < totalAmount; x++) {
        //color switching
        if (blockX < (width / 2) * BLOCK_WIDTH + PlayBoard.x) {
            //((PlayBoard.width / 2)+ PlayBoard.x - 19)) {
            if (blockY <= (PlayBoard.height + PlayBoard.y) / 2) {
                //player 1 green
                tempBlock = new Block(blockX, blockY, Player1.shooterColor);
                Player1.numBlocks += 1;
            } else {
                //player 3 yellow
                tempBlock = new Block(blockX, blockY, Player3.shooterColor);
                Player3.numBlocks += 1;
            }
        } else {
            if (blockY <= (PlayBoard.height + PlayBoard.y) / 2) {
                //player 2 red
                tempBlock = new Block(blockX, blockY, Player2.shooterColor);
                Player2.numBlocks += 1;
            } else {
                //player 4 purple
                tempBlock = new Block(blockX, blockY, Player4.shooterColor);
                Player4.numBlocks += 1;
            }
        }
        blockX = blockX + BLOCK_WIDTH;

        if (blockX + BLOCK_WIDTH >= PlayBoard.width + PlayBoard.x + 19) {
            blockX = PlayBoard.x;
            blockY += BLOCK_WIDTH;
        }

        blocks.push(tempBlock);
    }
}

function checkIfBallsGotResizedOut() {
    balls.forEach((x, inc) => {
        if (x.x < canvas.x || x.x > canvas.x + canvas.width) {
            balls.splice(inc, 1);
        }
        else if (x.y < canvas.y || x.y > canvas.y + canvas.height) {
            balls.splice(inc, 1);
        }
    })
}


var last = 0;


function animation(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    PlayBoard.draw();
    if (PlayBoard.needToResetBoard) {
        calculateNumOfBlocks();
        PlayBoard.needToResetBoard = false;

    }
    blocks.forEach((x) => {
        x.draw();
    });
    players.forEach((x) => {
        if (x.canPlay) {
            x.drawShooter();
        }
        
    });
    

    if(!last || now - last >= 250) {
        last = now;
        players.forEach((x) => {
            if (!x.fire && x.canPlay) {
                x.randomizeShots();
            }
            
        })
    };
    players.forEach((x) => {
        if (x.fire && x.canPlay) {
            if(!x.last || now - x.last >= 100) {
                x.last = now;
                x.shoot();
            };
        }
    });
    balls.forEach((x, inc1) => {
        x.update();
        x.draw();
        let stopBool = false;
        let counterLeft = 0; 
        let counterRight = blocks.length - 1;
        while (!stopBool) {
            if (counterLeft > counterRight) {
                //final test
                let q = blocks[counterLeft].testHit(x.color, x.x, x.y);
                if (q.inBox) {
                    stopBool = true;
                    if (q.differentColor) {
                        balls.splice(inc1, 1);
                    }
                    
                }
                
            } else {
                let q1 = blocks[counterLeft].testHit(x.color, x.x, x.y);
                let q2 = blocks[counterRight].testHit(x.color, x.x, x.y);
                if (q1.inBox || q2.inBox) {
                    stopBool = true;
                    if (q1.differentColor || q2.differentColor) {
                        balls.splice(inc1, 1);
                    }
                }
            }

            counterLeft+=1;
            counterRight-=1;
        }
        /*
        blocks.forEach((y, inc2) => {
            //maybe pointers on each end to move towards instead of forEach?
            let q = y.testHit(x.color, x.x, x.y);
            if (q) {
                balls.splice(inc1, 1);
            }
        })*/
    });

    setTimeout(() => {
        window.requestAnimationFrame(animation);
    }, 0);

}
animation();
