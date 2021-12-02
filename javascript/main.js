const canvas = document.querySelector("#canvas");
const message = document.querySelector("#message");
const ctx = canvas.getContext("2d");
//console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
message.style.display = "none";
let resize = false;

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
        ctx.lineTo(
            xCoord + calculateWidth(60, this.degrees),
            yCoord + calculateHeight(60, this.degrees)
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
        /* 

        this.check = 1;
        this.count = 1;
        this.degrees = 90;
        this.minDegrees = 0;
        
        ctx.rotate(this.check * Math.PI / 180);
        this.count += this.check;
        if (this.count === this.degrees || this.count === this.minDegrees) {
            this.check *= -1;
        }
        
        
        */
    }

    setPlayer = (count) => {
        if (count === 1) {
            this.x = 0;
            this.y = 0;
            this.shooterColor = "green";
            this.startPosition = 89;
            this.degrees = 89;
           
            this.maxDegreesChange = 1;
            this.progression = -1;
        }
        if (count === 2) {
            this.x = canvas.width - this.width;
            this.y = 0;
            this.shooterColor = "red";
            this.startPosition = -181;
            this.degrees = -181;
           
            this.maxDegreesChange = -271;
            this.progression = -1;
        }
        if (count === 3) {
            this.x = 0;
            this.y = canvas.height - this.height;
            this.shooterColor = "yellow";
            this.startPosition = -1;
            this.degrees = -1;
           
            this.maxDegreesChange = -89;
            this.progression = -1;
        }
        if (count === 4) {
            this.x = canvas.width - this.width;
            this.y = canvas.height - this.height;
            this.shooterColor = "purple";
            this.startPosition = -91;
            this.degrees = -91;
           
            this.maxDegreesChange = -179;
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
        this.width = 20;
        this.height = 20;
    }

    testHit(color, ballX, ballY) {
        //if the colors are the same, ignore colision
        if (color === this.color) {
            return false;
        } else {
            if (
                ballX > this.x &&
                ballX < this.x + this.width &&
                this.ballY > this.y &&
                this.ballY < this.y + this.height
            ) {
                this.color = color;
                return true;
            }
        }
        return false;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.rect(this.x, this.y, 20, 20);
        ctx.fill();

        ctx.stroke();
    }
}

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
        this.width = Math.floor(this.width / 20) * 20;
        this.height = Math.floor(this.height / 20) * 20;
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
    blocks = [];
    let width = PlayBoard.width / 20;
    let height = PlayBoard.height / 20;
    let totalAmount = width * height;

    let blockX = PlayBoard.x;
    let blockY = PlayBoard.y;
    let tempBlock;
    for (let x = 0; x < totalAmount; x++) {
        //color switching
        if (blockX < (width / 2) * 20 + PlayBoard.x) {
            //((PlayBoard.width / 2)+ PlayBoard.x - 19)) {
            if (blockY <= (PlayBoard.height + PlayBoard.y) / 2) {
                //player 1 green
                tempBlock = new Block(blockX, blockY, Player1.shooterColor);
            } else {
                //player 3 yellow
                tempBlock = new Block(blockX, blockY, Player3.shooterColor);
            }
        } else {
            if (blockY <= (PlayBoard.height + PlayBoard.y) / 2) {
                //player 2 red
                tempBlock = new Block(blockX, blockY, Player2.shooterColor);
            } else {
                //player 4 purple
                tempBlock = new Block(blockX, blockY, Player4.shooterColor);
            }
        }
        blockX = blockX + 20;

        if (blockX + 20 >= PlayBoard.width + PlayBoard.x + 19) {
            blockX = PlayBoard.x;
            blockY += 20;
        }

        blocks.push(tempBlock);
    }
}

function animation() {
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
        x.drawShooter();
    });
    setTimeout(() => {
        window.requestAnimationFrame(animation);
    }, 50);
}
animation();
