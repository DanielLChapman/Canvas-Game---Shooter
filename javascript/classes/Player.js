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
                this.numShots *= 2;
                
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