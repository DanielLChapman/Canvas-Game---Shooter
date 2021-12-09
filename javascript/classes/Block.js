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