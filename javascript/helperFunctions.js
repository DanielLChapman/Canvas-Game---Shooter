
//Angular calculation for shooting, width calculator
function calculateWidth(hyp, a) {
    return hyp * Math.cos(a * Math.PI/180);
}
//Angular calculation for shooting, height calculator
function calculateHeight(hyp,a) {
    return hyp * Math.sin(a * Math.PI / 180);
}

//random number generator between two numbers
function rnd(min, max) {
    return Math.floor(Math.random() * max) + min;
}

//open close settings
function openCloseSettings(setting) {
    if (setting === 'Open') {
        document.querySelector('#canvas-settings-window').style.display = 'block';
    } else {
        document.querySelector('#canvas-settings-window').style.display = 'none';
    }

}

//Event Handlers
let blockSizeSlider = document.getElementById('blockSize');
let ballSpeed = document.getElementById('ballSpeed');

//block size
blockSizeSlider.oninput = function() {
    //get the value
    BLOCK_WIDTH = parseInt(this.value, 10);
    document.querySelector('#block-size-value').innerHTML = BLOCK_WIDTH;
    //resize the board to the new size
    PlayBoard.checkWidthAndHeight() 
    resize = true;
    calculateNumOfBlocks(false);
}

//ball speed
ballSpeed.oninput = function() {
    //if the value is different
    if (this.value !== SPEED_CONTROL) {
        //update the current balls that exist right now
        balls.forEach((x) => {
            x.xSpeed = x.xSpeed * (175 / SPEED_CONTROL) * (this.value / 175);
            x.ySpeed = x.ySpeed * (175 / SPEED_CONTROL) * (this.value / 175)
        })
        //set the new value
        SPEED_CONTROL = this.value;
        document.querySelector('#ball-speed-value').innerHTML = SPEED_CONTROL;
    }
}

//How much is added when a ball or random generator hits the addition side.
document.querySelector("#additionValue").oninput = function () {
    let val = parseInt(this.value, 10);
    if (val < 0) {
        val = 0;
    }
    addition = val;
    this.value = addition;
};

//multiplication value that is added
document.querySelector("#multiplicationValue").oninput = function () {
    let val = parseInt(this.value, 10);
    if (val < 0) {
        val = 0;
    }
    multiplication = val;
    this.value = multiplication;
};

//Adjusts the max plinko size (plinko is what impeeds the particles)
document.querySelector("#maxPlinkoSize").oninput = function () {
    let val = parseInt(this.value, 10);
    //max of 20, min of 1
    if (val < 1 || val > 20) {
        val = 20;
    }

    plinkoMaxSize = val;
    //If the min size is greater, we want to swap the two values and update the inputs on the front end
    if (plinkoMinSize > plinkoMaxSize) {
        let temp = plinkoMaxSize;
        plinkoMaxSize = plinkoMinSize;
        plinkoMinSize = temp;
        document.querySelector("#minPlinkoSize").value = plinkoMinSize;
    }
    this.value = plinkoMaxSize;
    windowSetup();
};

//Minimum plinko size
document.querySelector("#minPlinkoSize").oninput = function () {
    let val = parseInt(this.value, 10);
    if (val < 1 || val > 20) {
        val = 1;
    }
    plinkoMinSize = val;
    //if the value is greater than the max size, we swap them and update the front end
    if (plinkoMinSize > plinkoMaxSize) {
        let temp = plinkoMaxSize;
        plinkoMaxSize = plinkoMinSize;
        plinkoMinSize = temp;
        document.querySelector("#maxPlinkoSize").value = plinkoMaxSize;
    }
    this.value = plinkoMinSize;

    windowSetup();
};

//Gravity Slider to adjust the gravity value

let gravitySlider = document.querySelector("#gravityNum");

gravitySlider.oninput = function () {
    gravity = parseFloat(this.value);
    document.querySelector("#gravity-num-value").innerHTML = gravity;
    windowSetup();
};


//Plinko column slider, sets how many columns there should be (horizontal)
let colSlider = document.querySelector("#colNum");

colSlider.oninput = function () {
    cols = parseInt(this.value, 10);
    document.querySelector("#col-num-value").innerHTML = cols;
    windowSetup();
};

//Plinko column slider, sets how many rows there should be (veritcal)
let rowSlider = document.querySelector("#rowNum");

rowSlider.oninput = function () {
    rows = parseInt(this.value, 10);
    document.querySelector("#row-num-value").innerHTML = rows;
    windowSetup();
};

