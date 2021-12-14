class Board {
    constructor(playerWidth) {
        this.playerWidth = playerWidth
        this.baseX = 0 + playerWidth + 5;
        this.x = 0 + playerWidth + 5;
        this.baseY = 5;
        this.y = 5;
        this.width = canvas.width - playerWidth * 2 - 10;
        this.height = canvas.height - 15;
        this.backgroundColor = "#363636";
        this.color = "#000";
        this.gameRunning = false;
        this.needToResetBoard = true;
    }

    updateSize() {
        this.width = canvas.width - this.playerWidth * 2 - 10;
        this.height = canvas.height - 15;
    }

    checkWidthAndHeight() {
        let temp = this.width;
        this.width = Math.floor(this.width /BLOCK_WIDTH ) * BLOCK_WIDTH;
        temp = temp - this.width;
        temp /= 2;
        this.x = this.baseX + temp;
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