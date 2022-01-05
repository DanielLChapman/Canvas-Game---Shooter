class PlayerView {
    constructor(x, y, playerVal,width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.playerVal = playerVal;
        this.highlight = -1; 

    }

    drawScore(score = 0, wins) {
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.font = '14.5px serif';
        if ((this.playerVal === 3 || this.playerVal === 4) && plinkoPlay) {
            ctx.rect(this.x+15, this.y+205, this.width-30, 50);
            ctx.fillText(`Player ${this.playerVal}: Num Shots: ${score} Wins: ${wins}` , this.x+25, this.y+205+25);
        } else {
                let minusVal = plinkoPlay ? 10 : 0;
                ctx.rect(this.x+15, this.y+15-minusVal, this.width-30, 50);
                ctx.fillText(`Player ${this.playerVal}: Num Shots: ${score} Wins: ${wins}` , this.x+25, this.y+15+25-minusVal);
            
            
        }
        
        ctx.stroke();
        
        
        
        ctx.strokeStyle = 'black';
    }
    drawBoxOne(color) {
        
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.rect(this.x+15, this.y+15+50+10, this.width-30, 50);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillText(`x2` , this.x+25, this.y+15+50+10+25);
        ctx.stroke();
        ctx.closePath();
    }
    drawBoxTwo(color) {
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.rect(this.x+15, this.y+15+50+10+50+10, this.width-30, 50);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillText(`+2` , this.x+25, this.y+15+50+10+50+10+25);
        ctx.stroke();
        ctx.closePath();

    }
    drawBoxThree(color) {
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.rect(this.x+15, this.y+15+50+10+50+10+50+10, this.width-30, 50);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillText(`Firing` , this.x+25, this.y+15+50+10+50+10+50+10+25);
        ctx.stroke();
        ctx.closePath();

    }

    drawBoxes(shootOption) {
        this.drawBoxOne(shootOption === 1 ? 'blue' : 'white');
        this.drawBoxTwo(shootOption === 2 ? 'blue' : 'white');
        this.drawBoxThree(shootOption === 3 ? 'blue' : 'white');

    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#363636';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.stroke();

    }
}