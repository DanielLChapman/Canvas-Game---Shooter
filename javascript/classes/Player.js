class Player {
    //initial values and booleans for game options
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
        this.gui = null;
        this.shootOption = 0;
        this.wins = 0;
        this.playerNum = 1;
    }

    //Updating shots from Plinko Position.
    //Separate from other function because it runs every second and has different properties. 
    updateShots(typeOfUpdate) {
        if (!this.fire) {
            switch (typeOfUpdate) {
                case "addition":
                    this.numShots += addition || 2;
                    break;
                case "multiplication":
                    if (this.numShots === 0) {
                        this.numShots = 1;
                    }
                    this.numShots *= multiplication || 2;
                    break;
                case "fire":
                    this.fire = true;
                    break;
                default:
                    console.log(typeOfUpdate);
            }
        }
    }

    //randomizing the shots
    randomizeShots = (plinkoRandomize) => {
        if (!this.fire) {
            //if plinko is on, we are making particles here which will then run the other shot function.
            if (plinkoRandomize) {
                newParticle(random(245), 0, this.playerNum, this.shooterColor);
            } else {
                //otherwise lets just randomize the values
                let x = Math.floor(Math.random() * 3);
                if (x === 0) {
                    //incase the numShots are empty, we want to have at least one.
                    if (this.numShots === 0) {
                        this.numShots = 1;
                    }
                    this.numShots *= multiplication || 2;
                    this.shootOption = 1;
                } else if (x === 2) {
                    
                    this.numShots += addition || 2;
                    this.shootOption = 2;
                } else {
                    this.fire = true;
                    this.shootOption = 3;
                }
            }
        }
    };
    
    //eliminating the player
    eliminate() {
        this.canPlay = false;
    }

    //Actual firing function
    shoot() {
        //If there are shots, -1 and summon, stop the firing if this is the last ball.
        if (this.numShots > 0) {
            this.numShots -= 1;
            if (this.numShots === 0) {
                this.fire = false;
            }
            //new Particle based on the position of the shooter
            let shot = new Ball(
                this.lineToX,
                this.lineToY,
                calculateWidth(60, this.degrees) * (SPEED_CONTROL / 175),
                calculateHeight(60, this.degrees) * (SPEED_CONTROL / 175),
                this.shooterColor
            );
            //Add to array
            balls.push(shot);
        } else { 
            //Otherwise add a shot and then fire it
            this.numShots = 1;
            this.shoot();
        }
    }

    //Draw and update the shooter based on the incrememnt established. 
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
        ctx.lineTo(this.lineToX, this.lineToY);
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

    //Redraws the guis based on current position of current player
    updateGUIPosition(count) {
        switch (count) {
            case 1:
                this.x = 0;
                this.y = 0;
                this.gui = new PlayerView(
                    this.x,
                    this.y,
                    1,
                    PLAYER_WIDTH,
                    PLAYER_HEIGHT
                );
                break;
            case 2:
                this.x = canvas.width - this.width;
                this.y = 0;
                this.gui = new PlayerView(
                    this.x,
                    this.y,
                    2,
                    PLAYER_WIDTH,
                    PLAYER_HEIGHT
                );
                break;
            case 3:
                this.x = 0;
                this.y = canvas.height - this.height + 35;
                this.gui = new PlayerView(
                    this.x,
                    this.y,
                    3,
                    PLAYER_WIDTH,
                    PLAYER_HEIGHT
                );
                break;
            case 4:
                this.x = canvas.width - this.width;
                this.y = canvas.height - this.height + 35;
                this.gui = new PlayerView(
                    this.x,
                    this.y,
                    4,
                    PLAYER_WIDTH,
                    PLAYER_HEIGHT
                );
                break;
            default:
                console.log(count);
        }
    }

    //Each player has different starting values so needed a way to establish which player is which
    //startPosition to maxDegreesChange is the angle that the shooter will fire, progression is how it starts, degrees is where it currently is.
    setPlayer = (count) => {
        if (count === 1) {
            this.x = 0;
            this.playerNum = 1;
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
            this.playerNum = 2;
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
            this.playerNum = 3;
            this.maxDegreesChange = -89.5;
            this.progression = -1;
        }
        if (count === 4) {
            this.x = canvas.width - this.width;
            this.y = canvas.height - this.height;
            this.shooterColor = "purple";
            this.startPosition = -89.5;
            this.degrees = -89.5;
            this.playerNum = 4;

            this.maxDegreesChange = -179.5;
            this.progression = -1;
        }
    };
}
