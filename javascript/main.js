const canvas = document.querySelector("#canvas");
const message = document.querySelector("#message");
const ctx = canvas.getContext("2d");
//console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
message.style.display = "none";

let PAUSE = false;
let PLAYER_WIDTH = 250;
let PLAYER_HEIGHT = 300;

let BLOCK_WIDTH = 25;
let resize = false;
let balls = [];

let amountOfChecks = 0;
let numFrames = 0;

const PlayBoard = new Board(PLAYER_WIDTH);
PlayBoard.checkWidthAndHeight();

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

let blocks = [];

function calculateNumOfBlocks() {
    players.forEach((x) => {
        x.canPlay = true;
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

var last = 0;
var amountLast = 0;

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
    numFrames++;

    if (!last || now - last >= 1000) {
        last = now;
        console.log(numFrames);
        numFrames = 0;
        players.forEach((x) => {
            if (!x.fire && x.canPlay) {
                x.randomizeShots();
            }
        });
        /* try {
            let xVal = Math.floor((balls[0].x - PlayBoard.x) / BLOCK_WIDTH);
            let yVal = Math.floor((balls[0].y - PlayBoard.y) / BLOCK_WIDTH);
            let width = PlayBoard.width / BLOCK_WIDTH;
            let height = PlayBoard.height / BLOCK_WIDTH;
            blocks.forEach((x, inc) => {
                let y = x.testHit(balls[0].color, balls[0].x, balls[0].y);
                if (y.inBox) {
                    console.log(yVal * width + xVal === inc);
                }
            });
        } catch (Err) {} */
    }
    let playersStillIn = 0;
    players.forEach((x) => {
        if (x.fire && x.canPlay) {
            if (!x.last || now - x.last >= 50) {
                x.last = now;
                x.shoot();
            }
        }

        x.canPlay ? (playersStillIn += 1) : (playersStillIn += 0);
    });

    if (playersStillIn === 1) {
        PAUSE = true;
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
            amountOfChecks += 1;
            if (q1 && !q1.inBox) {
                amountOfChecks += 6;
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
                            amountOfChecks+=1;
                        } else {
                            q2 = blocks[counterRight].testHit(
                                x.color,
                                x.x,
                                x.y
                            );
                            amountOfChecks+=1;
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

        /*
        blocks.forEach((y, inc2) => {
            //maybe pointers on each end to move towards instead of forEach?
            let q = y.testHit(x.color, x.x, x.y);
            if (q) {
                balls.splice(inc1, 1);
            }
        })*/
    });

    if (!amountLast || now - amountLast >= 60000) {
        amountLast = now;
        console.log(amountOfChecks);
        amountOfChecks = 0;
    }

    setTimeout(() => {
        if (!PAUSE) {
            window.requestAnimationFrame(animation);
        } else {
            console.log(amountOfChecks);
        }
    }, 0);
}
animation();
