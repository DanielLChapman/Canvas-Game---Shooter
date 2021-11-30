const canvas=document.querySelector("#canvas");
const message = document.querySelector('#message');
const ctx=canvas.getContext("2d");
//console.log(ctx);
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
message.style.display = 'none'; 
let resize = false;

window.addEventListener("resize",(e)=>{
    resize = true;
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  if (window.innerWidth < 800 || window.innerHeight < 600) {
    canvas.style.display = 'none';
    message.style.display = 'block';
  } else {
    canvas.style.display = 'block';
    message.style.display = 'none'; 
  }
});

class Player {
    constructor() {
        this.width = 250;
        this.height = 300;
        this.opacity = 1;
        this.backgroundColor = "#363636";
        this.shooterColor = "black"
        this.x = 0;
        this.y = 0;
        this.exit = false;
        this.degrees = 90;
        this.progression = 1;
        this.maxDegreesChange = 90;
        this.startPosition = 0;
        this.numShots = 1;
    };

    drawShooter() {
        //draw a rect with an angle 

    }

    setPlayer = (count) => {
        
        if (count === 1) {
            this.x = 0;
            this.y = 0;
            this.startPosition = 0;
            this.shooterColor = "green";
            this.maxDegreesChange = -90;
            this.progression = -1;
        }
        if (count === 2) {
            this.x = canvas.width - this.width;
            this.y = 0;
            this.startPosition = 180;
            this.shooterColor = "red";
            this.maxDegreesChange = 270;
        }
        if (count === 3) {
            this.x = canvas.height - this.height;
            this.y = 0;
            this.startPosition = 0;
            this.shooterColor = "yellow";
            this.maxDegreesChange = 90;
        }
        if (count === 4) {
            this.x = canvas.width - this.width;
            this.y = canvas.height - this.height;
            this.startPosition = 180;
            this.shooterColor = "purple";
            this.maxDegreesChange = 90;
            this.progression = -1;
        
        }
    }
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
        }
        else {
            if(ballX >this.x && ballX < this.x+this.width && this.ballY > this.y && this.ballY < this.y+this.height) {
                this.color = color;
                return true;
            }
        }
        return false;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.rect(this.x,this.y,20,20);
        ctx.fill();
        ctx.stroke();
    }
};


class Board {
    constructor() {
        this.x = 0 + Player1.width + 5;
        this.y = 5;
        this.width = canvas.width - Player1.width*2 - 10;
        this.height = canvas.height - 15;
        this.backgroundColor = "#363636";
        this.color = "#000";
        this.gameRunning = false;
        this.needToResetBoard = true;
    };

    updateSize() {
        this.width = canvas.width - Player1.width*2 - 10;
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
        ctx.fillStyle=this.backgroundColor;
        ctx.strokeStyle=this.color;
        ctx.lineWidth = 2;
        ctx.fillRect(this.x,this.y,this.width,this.height);
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
        if (blockX < ((width / 2) * 20 + PlayBoard.x)) {//((PlayBoard.width / 2)+ PlayBoard.x - 19)) {
            if (blockY <= ((PlayBoard.height + PlayBoard.y) / 2)) {
                //player 1 green
                tempBlock = new Block(blockX, blockY, Player1.shooterColor)
            } else {
                //player 3 yellow
                tempBlock = new Block(blockX, blockY, Player3.shooterColor)
            }
            
        } else {
            if (blockY <= ((PlayBoard.height + PlayBoard.y) / 2)) {
                //player 2 red
                tempBlock = new Block(blockX, blockY, Player2.shooterColor)
            } else {
                //player 4 purple
                tempBlock = new Block(blockX, blockY, Player4.shooterColor)
            }
        }
        blockX = blockX + 20;

        if (blockX + 20 >= PlayBoard.width  + PlayBoard.x + 19) {
            blockX = PlayBoard.x;
            blockY += 20;
        }

        blocks.push(tempBlock);
    }
}


function animation(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  PlayBoard.draw();
  if (PlayBoard.needToResetBoard) {
      calculateNumOfBlocks();
      PlayBoard.needToResetBoard = false;
  }
  blocks.forEach((x) => {
      x.draw();
  })
  window.requestAnimationFrame(animation);
}
animation();