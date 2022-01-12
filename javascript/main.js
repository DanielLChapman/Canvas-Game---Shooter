//general canvas setup

const canvas = document.querySelector("#canvas");
const canvasMessage = document.querySelector("#canvas-settings");
const message = document.querySelector("#message");
const ctx = canvas.getContext("2d");
//console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//dont want the victory screen up at the start
message.style.display = "none";

//Editable Values
let BLOCK_WIDTH = 40;
let SPEED_CONTROL = 15;
let PAUSE = false;
let plinkoPlay = false;
let multiplication = 2;
let addition = 2;

const PLAYER_WIDTH = 250;
const PLAYER_HEIGHT = 300;

//Initial values
let resize = false;
let updatePlayerGUI = true;

//True if resize
let CHECK_BALLS = false;

//initializing
let blocks = [];
let balls = [];

//Initialize a new game
const PlayBoard = new Board(PLAYER_WIDTH);
PlayBoard.checkWidthAndHeight();

//Setup 4 players
const Player1 = new Player();
Player1.setPlayer(1);

const Player2 = new Player();
Player2.setPlayer(2);

const Player3 = new Player();
Player3.setPlayer(3);

const Player4 = new Player();
Player4.setPlayer(4);

const players = [Player1, Player2, Player3, Player4];

//Resize handler
window.addEventListener("resize", (e) => {
    //On Resize, set it true, make sure no balls are outside the canvas and reposition the GUIs
    resize = true;
    CHECK_BALLS = true;
    updatePlayerGUI = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //If the browser window is now too small, lets hide it.
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

//Board setup for coloring blocks
function calculateNumOfBlocks(unpause) {
    //reset the number of blocks each player has
    //dont think this is really used anymore
    players.forEach((x) => {
        x.numBlocks = 0;
    });
    //reset the blocks
    blocks = [];
    //When we resize, we set the PlayBoard to be an even value of BLOCK_WIDTH so there is no overhang
    let width = PlayBoard.width / BLOCK_WIDTH;
    let height = PlayBoard.height / BLOCK_WIDTH;
    //Total amount of blocks to expect to make
    let totalAmount = width * height;
    //initial values
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

    if (unpause) {
        setPause(false);
    }
}

//Checks if a ball is outside the bounds
function individualCheck(ballObject, inc) {
    let x = ballObject;
    if (x.x < PlayBoard.x || x.x > PlayBoard.x + PlayBoard.width) {
        balls.splice(inc, 1);
    } else if (x.y < PlayBoard.y || x.y > PlayBoard.y + PlayBoard.height) {
        balls.splice(inc, 1);
    }
}

//Function that calls the individualCheck for each ball
function checkIfBallsGotResizedOut() {
    balls.forEach((x, inc) => {
        individualCheck(x, inc);
    });
}

//Alternate PAUSE/UNPAUSE
function setPause(boolVal) {
    if (boolVal) {
        PAUSE = true;
        document.getElementById("pause").innerHTML = `Paused`;
    } else {
        PAUSE = false;
        document.getElementById("pause").innerHTML = `Pause`;
        animation();
    }
}

//time management
var last = 0;
var secondCounter = 0;

//victory window setup
let window2 = document.querySelector(".victory-window");
window2.style.display = "none";

//REset
function reset() {
    //Reset the players
    players.forEach((x) => {
        x.canPlay = true;
        x.numBlocks = 0;
        x.numShots = 1;
    });
    //Reset the balls
    balls = [];
    //Reset the board
    calculateNumOfBlocks();
    //Hide victory windows
    window2.style.display = "none";
    window2.innerHTML = "";
    //Start
    if (PAUSE) {
        setPause(false);
    }
}

function animation(now) {
    //if we aren't paused
    if (!PAUSE) {
        //reset the board
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#363636";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw the board
        PlayBoard.draw();
        //If we need to recalculate the board, do so here (after resizing)
        if (PlayBoard.needToResetBoard) {
            calculateNumOfBlocks(false);

            PlayBoard.needToResetBoard = false;
        }
        //Draw each block
        blocks.forEach((x) => {
            x.draw();
        });

        //Every Second, calculate the firing option
        if (!last || now - last >= 1000) {
            last = now;
            numFrames = 0;
            players.forEach((x) => {
                if (!x.fire && x.canPlay) {
                    x.randomizeShots(plinkoPlay ? true : false);
                }
            });
        }
        //Initial values to calculate winner
        let playersStillIn = 0;
        let playersStillInArray = [];
        //IF there is only 1 player left, they win.
        //Otherwise if its been more than 50ms, fire the next ball if they have it and are shooting
        players.forEach((x) => {
            if (x.fire && x.canPlay) {
                if (!x.last || now - x.last >= 50) {
                    x.last = now;
                    x.shoot();
                }
            }

            if (x.canPlay) {
                playersStillInArray.push(x);
            }
        });

        //Victory window
        if (playersStillInArray.length === 1) {
            PAUSE = true;
            playersStillInArray[0].wins++;
            window2.style.display = "block";
            window2.innerHTML = `${playersStillInArray[0].shooterColor} Wins!`;
        }
        //Redraws GUIS
        players.forEach((x, count) => {
            //x.gui.draw();
            if (updatePlayerGUI) {
                x.updateGUIPosition(count + 1);
                if (count === 3) {
                    updatePlayerGUI = false;
                }
            }
            x.gui.drawScore(x.numShots, x.wins);
            if (x.canPlay) {
                x.drawShooter();
                if (!plinkoPlay) {
                    x.gui.drawBoxes(x.shootOption);
                }
            }
        });

        //Check if the balls got moved if resized or bugged
        if (CHECK_BALLS) {
            checkIfBallsGotResizedOut();
            CHECK_BALLS = false;
        }
        //For each particle
        balls.forEach((x, inc1) => {
            //update its position
            x.update(PlayBoard);
            //draw it
            x.draw();
            //initial values for checking its position
            let stopBool = false;
            let counterLeft = 0;
            let counterRight = blocks.length - 1;

            try {
                //take a 2.5 pixel radius around the ball to check if any aspect is in enough of a block
                let xVal1 = Math.floor((x.x - PlayBoard.x) / BLOCK_WIDTH);
                let xVal2 = Math.floor((x.x + 2.5 - PlayBoard.x) / BLOCK_WIDTH);
                let xVal3 = Math.floor((x.x - 2.5 - PlayBoard.x) / BLOCK_WIDTH);
                let yVal1 = Math.floor((x.y - PlayBoard.y) / BLOCK_WIDTH);
                let yVal2 = Math.floor((x.y + 2.5 - PlayBoard.y) / BLOCK_WIDTH);
                let yVal3 = Math.floor((x.y - 2.5 - PlayBoard.y) / BLOCK_WIDTH);

                let width = PlayBoard.width / BLOCK_WIDTH;

                let q1;
                //check if we mathematically counted the correct block based on ball position
                q1 = blocks[yVal1 * width + xVal1]?.testHit(x.color, x.x, x.y);
                //if we didn't check the 2.5 pixel radius around
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
                //We resort to the old fashion way of looping over all the blocks to check the particle position
                if (q1 && !q1.inBox) {
                    while (!stopBool) {
                        try {
                            //odds the particle will be closer to the shooter thus in the same color so we want to start either at the start or the end
                            if (
                                x.shooterColor === "green" ||
                                x.shooterColor === "red"
                            ) {
                                q1 = blocks[counterLeft].testHit(
                                    x.color,
                                    x.x,
                                    x.y
                                );
                            } else {
                                q2 = blocks[counterRight].testHit(
                                    x.color,
                                    x.x,
                                    x.y
                                );
                            }

                            //If we hit, splice it
                            if ((q1 && q1?.inBox) || (q2 && q2?.inBox)) {
                                stopBool = true;
                                if (q1?.differentColor || q2?.differentColor) {
                                    balls.splice(inc1, 1);
                                }
                            }
                        } catch (err) {
                            stopBool = true;
                        }
                        //increment counters
                        counterLeft += 1;
                        counterRight -= 1;
                    }
                }
                //otherwise we check if the colors match
                //if they dont, it changes hands!
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

    //loop function in a timeout incase I ever wanted to slow it down its easy.
    setTimeout(() => {
        if (!PAUSE) {
            window.requestAnimationFrame(animation);
        }
    }, 0);
}
animation();
