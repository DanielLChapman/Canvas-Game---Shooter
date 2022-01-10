class PlayerView {
    //Class for the GUI on the sides of the screen 
    constructor(x, y, playerVal,width, height) {
        //where it starts
        this.x = x;
        this.y = y;
        //how large they are
        this.width = width;
        this.height = height;
        //player value
        this.playerVal = playerVal;
        //which option to highlight (initial is -1 as nothing should be until it randomizes)
        this.highlight = -1; 

    }

    //Drawing the first box
    drawScore(score = 0, wins) {
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.font = '14.5px serif';
        //If plinko is open, move this box down for players 3 and 4
        if ((this.playerVal === 3 || this.playerVal === 4) && plinkoPlay) {
            ctx.rect(this.x+15, this.y+205, this.width-30, 50);
            ctx.fillText(`Player ${this.playerVal}: Num Shots: ${score} Wins: ${wins}` , this.x+25, this.y+205+25);
        } else {
            //Otherwise it should be at the top of the gui
                let minusVal = plinkoPlay ? 10 : 0;
                ctx.rect(this.x+15, this.y+15-minusVal, this.width-30, 50);
                ctx.fillText(`Player ${this.playerVal}: Num Shots: ${score} Wins: ${wins}` , this.x+25, this.y+15+25-minusVal);
            
            
        }
        
        ctx.stroke();
        
        
        
        ctx.strokeStyle = 'black';
    }

    //drawing the three gui boxes
    drawBoxes123(color, y, text,  textY) {
        //draw the surrounding box
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.rect(this.x+15, y, this.width-30, 50);
        ctx.stroke();
        ctx.closePath();

        //draw the text
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        //grab the multiplication value
        ctx.fillText(text , this.x+25, textY);
        ctx.stroke();
        ctx.closePath();
    }

    //Draw the boxes
    drawBoxes(shootOption) {
        this.drawBoxes123(shootOption === 1 ? 'blue' : 'white', this.y+15+50+10,`x${multiplication || 2}` , this.y+15+50+10+25)
        this.drawBoxes123(shootOption === 2 ? 'blue' : 'white', this.y+15+50+10+50+10,`+${addition || 2}` ,  this.y+15+50+10+50+10+25)
        this.drawBoxes123(shootOption === 3 ? 'blue' : 'white', this.y+15+50+10+50+10+50+10, `Firing` ,  this.y+15+50+10+50+10+50+10+25)

    }

}