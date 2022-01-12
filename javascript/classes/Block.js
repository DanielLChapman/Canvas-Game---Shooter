class Block {
    //initial values
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
            //check a 2.5 radius around the particle to see if they fit in the blocks range
            (ballX+2.5 >= this.x &&
            ballX+2.5 <= this.x + this.width) &&
            (ballY+2.5 >= this.y &&
            ballY+2.5 <= this.y + this.height)
        ) {
            //if they are the same color, ignore
            if (color === this.color) {
                return {inBox: true, differentColor: false};
            }
            
            //otherwise we remove it and swap hands of the block and eliminate the player if they are out of blocks.
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

    //drawing
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.stroke();
    }
}