class Ball {
    constructor(x, y, xSpeed, ySpeed, color) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.color = color;
    }

    update(PlayBoard) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.x < PlayBoard.x || this.x > PlayBoard.x + PlayBoard.width) {
            this.xSpeed *= -1;
        }
        if (this.y < PlayBoard.y || this.y > PlayBoard.y + PlayBoard.height) {
            this.ySpeed *= -1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
    }
}