const canvas = document.querySelector("#canvas");
const canvasMessage = document.querySelector("#canvas-settings");
const message = document.querySelector("#message");
const ctx = canvas.getContext("2d");
//console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
message.style.display = "none";



let blockSizeSlider = document.getElementById('blockSize');
let ballSpeed = document.getElementById('ballSpeed');

let BLOCK_WIDTH = 40;
let SPEED_CONTROL = 15;
let PAUSE = false;
let blocks = [];

let PLAYER_WIDTH = 250;
let PLAYER_HEIGHT = 300;




let resize = false;
let updatePlayerGUI = true;
let CHECK_BALLS = false;
let balls = [];

let amountOfChecks = 0;
let numFrames = 0;

let plinkoPlay = false;

const PlayBoard = new Board(PLAYER_WIDTH);
PlayBoard.checkWidthAndHeight();

function togglePlinko() {
    plinkoPlay = !plinkoPlay;
    if (plinkoPlay) {
        document.querySelector('.plinko-container').style.display = 'block';
    } else {
        document.querySelector('.plinko-container').style.display = 'none';
    }
}



blockSizeSlider.oninput = function() {
    BLOCK_WIDTH = parseInt(this.value, 10);
    document.querySelector('#block-size-value').innerHTML = BLOCK_WIDTH;
    PlayBoard.checkWidthAndHeight() 
    resize = true;
    calculateNumOfBlocks(false);


}

ballSpeed.oninput = function() {
    if (this.value !== SPEED_CONTROL) {
        balls.forEach((x) => {
            x.xSpeed = x.xSpeed * (175 / SPEED_CONTROL) * (this.value / 175);
            x.ySpeed = x.ySpeed * (175 / SPEED_CONTROL) * (this.value / 175)
            if (x.xSpeed === 0 || x.ySpeed === 0) {

            }
        })
        SPEED_CONTROL = this.value;
        document.querySelector('#ball-speed-value').innerHTML = SPEED_CONTROL;
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

window.addEventListener("resize", (e) => {
    resize = true;
    CHECK_BALLS = true;
    updatePlayerGUI = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        
        canvas.style.display = "none";
        message.style.display = "block";
        canvasMessage.style.display = "none";
    } else {
        canvas.style.display = "block";
        canvasMessage.style.display = "block";
        message.style.display = "none";
    }
});



function calculateNumOfBlocks(unpause) {
    players.forEach((x) => {
        x.numBlocks = 0;
    });
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

    if(unpause) {
        setPause(false);
    }
}

function individualCheck(ballObject, inc) {
    let x = ballObject;
    if (x.x < PlayBoard.x || x.x > PlayBoard.x + PlayBoard.width) {
        balls.splice(inc, 1);
    } else if (x.y < PlayBoard.y || x.y > PlayBoard.y + PlayBoard.height) {
        balls.splice(inc, 1);
    }
}

function checkIfBallsGotResizedOut() {
    balls.forEach((x, inc) => {
        individualCheck(x, inc);
    });
}

function setPause(boolVal) {
    if (boolVal) {
        PAUSE = true;
        document.getElementById('pause').innerHTML = `Paused`;
    } else {
        PAUSE = false;
        document.getElementById('pause').innerHTML = `Start`;
        animation();
    }
} 

var last = 0;
var secondCounter = 0;

//victory window setup
let window2 = document.querySelector('.victory-window');
window2.style.display = 'none';


function reset() {
    players.forEach((x) => {
        x.canPlay = true;
        x.numBlocks = 0;
        x.numShots = 1;
    });
    balls = [];
    calculateNumOfBlocks();
    window2.style.display = 'none';
    window2.innerHTML = ""
    if (PAUSE) {
        setPause(false);
    }

}


function animation(now) {
    if (!PAUSE) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#363636';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    PlayBoard.draw();
    if (PlayBoard.needToResetBoard) {
        calculateNumOfBlocks(false);

        PlayBoard.needToResetBoard = false;
    }
    blocks.forEach((x) => {
        x.draw();
    });
    

    if (!last || now - last >= 1000) {
        last = now;
        numFrames = 0;
        players.forEach((x) => {
            if (!x.fire && x.canPlay) {
                x.randomizeShots(plinkoPlay ? true : false);

            }
        });
    }
    let playersStillIn = 0;
    let playersStillInArray = [];
    players.forEach((x) => {
        if (x.fire && x.canPlay) {
            if (!x.last || now - x.last >= 50) {
                x.last = now;
                x.shoot();
            }
        }

        if (x.canPlay) {
            playersStillInArray.push(x)
        };
    });


    if (playersStillInArray.length === 1) {
        PAUSE = true;
        playersStillInArray[0].wins++;
        window2.style.display = 'block';
        window2.innerHTML = `${playersStillInArray[0].shooterColor} Wins!`;
        
    }
    players.forEach((x, count) => {
        
        //x.gui.draw();
        if (updatePlayerGUI) {
            x.updateGUIPosition(count+1);
            if (count === 3) {
                updatePlayerGUI = false;
            }
        }
        x.gui.drawScore(x.numShots, x.wins);
        if (x.canPlay) {
            x.drawShooter();
            if (!plinkoPlay) {x.gui.drawBoxes(x.shootOption)};
        }
        
    });

    if (CHECK_BALLS) {
        checkIfBallsGotResizedOut();
        CHECK_BALLS = false;
    }
    balls.forEach((x, inc1) => {
        x.update(PlayBoard);
        x.draw();
        let stopBool = false;
        let counterLeft = 0;
        let counterRight = blocks.length - 1;
        try {
            let xVal1 = Math.floor((x.x - PlayBoard.x) / BLOCK_WIDTH);
            let xVal2 = Math.floor((x.x + 2.5 - PlayBoard.x) / BLOCK_WIDTH);
            let xVal3 = Math.floor((x.x - 2.5 - PlayBoard.x) / BLOCK_WIDTH);
            let yVal1 = Math.floor((x.y - PlayBoard.y) / BLOCK_WIDTH);
            let yVal2 = Math.floor((x.y + 2.5 - PlayBoard.y) / BLOCK_WIDTH);
            let yVal3 = Math.floor((x.y - 2.5 - PlayBoard.y) / BLOCK_WIDTH);

            let width = PlayBoard.width / BLOCK_WIDTH;

            let q1;
            q1 = blocks[yVal1 * width + xVal1]?.testHit(x.color, x.x, x.y);
            if (q1 && !q1.inBox) {
                let temp1 = blocks[yVal1 * width + xVal2]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );
                let temp2 = blocks[yVal1 * width + xVal3]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );
                let temp3 = blocks[yVal2 * width + xVal1]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );
                let temp4 = blocks[yVal3 * width + xVal1]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );
                let temp5 = blocks[yVal2 * width + xVal2]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );
                let temp6 = blocks[yVal3 * width + xVal3]?.testHit(
                    x.color,
                    x.x,
                    x.y
                );

                if (temp1?.inBox) {
                    q1 = temp1;
                } else if (temp2?.inBox) {
                    q1 = temp2;
                } else if (temp3?.inBox) {
                    q1 = temp3;
                } else if (temp4?.inBox) {
                    q1 = temp4;
                } else if (temp5?.inBox) {
                    q1 = temp5;
                } else if (temp6?.inBox) {
                    q1 = temp6;
                }
            }
            let q2;

            //error in calculation
            if (q1 && !q1.inBox) {
                while (!stopBool) {
                    try {
                        if (
                            x.shooterColor === "green" ||
                            x.shooterColor === "red"
                        ) {
                            q1 = blocks[counterLeft].testHit(x.color, x.x, x.y);
                        } else {
                            q2 = blocks[counterRight].testHit(
                                x.color,
                                x.x,
                                x.y
                            );
                        }

                        if ((q1 && q1?.inBox) || (q2 && q2?.inBox)) {
                            stopBool = true;
                            if (q1?.differentColor || q2?.differentColor) {
                                balls.splice(inc1, 1);
                            }
                        }
                    } catch (err) {
                        stopBool = true;
                    }

                    counterLeft += 1;
                    counterRight -= 1;
                }
            }
            //otherwise we check if the colors match
            else {
                if (q1?.differentColor || (q2 && q2?.differentColor)) {
                    balls.splice(inc1, 1);
                }
            }
        } catch (error) {
            console.log(error);
        }

    });

    }

    setTimeout(() => {
        if (!PAUSE) {
            window.requestAnimationFrame(animation);
        }
    }, 0);
}
animation();
