//https://codepen.io/Alan_Chu/pen/bKaYye
//Adapted for this application from this codepen by Alan_Chu based on a coding challenge by Daniel Shiffman
// Coding Challenge #62.1: Plinko with Matter.js
// Part 1 - https://youtu.be/KakpnfDv_f0
// Part 2 - https://youtu.be/6s4MJcUyaUE
// Part 3 - https://youtu.be/jN-sW-SxNzk

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    // Constraint = Matter.Constraint,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;
var engine;
var world;
var mConstraint;

//p = particles, plinkos = plinkos and bounds are rectangular plinkos essentially
var p = [];
var plinkos = [];

var bounds = [];

//So as not to cause any confusion with the other canvas, canvas2 bottomB. 
var bottomB;
var canvas2;

//Particle size
let plinkoParticleSize = 6;

//Base values that can be modified
//cols and rows are how many columns and rows to fill
let cols = 10;
let rows = 10;
//Minimum plinko size and max, these are what the particles bounce off of
let plinkoMinSize = 1;
let plinkoMaxSize = 5;
let gravity = 2;

//Mouse click switch for whether to drop your own particles or not
let ownDrop = false;

//Dropping a new particle based on the given inputs and pushes it to the array
function newParticle(_x, _y, i, color = "orange") {
    let pA = new Particle(_x, _y, plinkoParticleSize, i, color);
    // console.log(pA.body)
    p.push(pA);
}

//Switch function to allow a player to drop their own plinkos and play with it seperately from the shooter game
function ownDropChange() {
    ownDrop = !ownDrop;
    if (ownDrop) {
        document.querySelector('#plinko-own-drop').innerHTML = "Dropping Your Own!"
    } else {
        document.querySelector('#plinko-own-drop').innerHTML = "Drop Your Own!"
    }
}

//Initial setup
function setup() {
    //establish color mode
    colorMode(HSB);
    //create a canvas
    canvas2 = createCanvas(240, windowHeight - 300);
    //place in parent container
    canvas2.parent(document.querySelector(".plinko-container"));
    //create physics engines
    engine = Engine.create();
    world = engine.world;

    //run initial setup
    windowSetup();

}


function mousePressed() {
  
    //grab the mouse position
    let mouseXClick = mouseX;
    let mouseYClick = mouseY;
    //if we are dropping out own
    if (ownDrop) {
        //if we are within the bounds of this canvas
        if (!(mouseXClick > width || mouseXClick < 0)) {
            if (!(mouseYClick > height - 80 || mouseYClick < 0)) {
                //create our own particle with player -1 to not influence the game.
                let color = `rgba(${Math.floor(random(0, 256))}, ${Math.floor(random(0, 256))},${Math.floor(random(0, 256))},1)`;
                newParticle(
                    mouseX,
                    mouseY,
                    -1,
                    color
                );
            }
        }
    } else {
        //If we are within the bounds
        if (!(mouseXClick > width || mouseXClick < 0)) {
            if (!(mouseYClick > height - 80 || mouseYClick < 0)) {
                //check if we are inside a plinko
                let remove = [];
                plinkos.forEach((xPlink, i) => {
                    if (
                        mouseXClick >= xPlink.body.bounds.min.x &&
                        mouseXClick <= xPlink.body.bounds.max.x &&
                        mouseYClick >= xPlink.body.bounds.min.y &&
                        mouseYClick <= xPlink.body.bounds.max.y
                    ) {
                        //if we are, remove it
                        World.remove(world, xPlink.body);
                        remove.push(i);
                    }
                });
                //remove it from the array if there is one.
                if (remove.length > 0) {
                    remove.forEach((x) => {
                        plinkos.splice(x, 1);
                    });
                } else {
                    //otherwise create a new one

                    let plinko = new Plinko(
                        mouseXClick,
                        mouseYClick,
                        random(plinkoMinSize, plinkoMaxSize)
                    );
                    plinkos.push(plinko);
                }
            }
        }
    }
}

//Removes the boundaries from the world and resets the array
//Otherwise the invisible boundaries would still exist.
function clearBoundrys() {
    bounds.forEach((x) => {
        World.remove(world, x.body);
    });

    bounds = [];
}

//Remove the plinkos from the world and array, otherwise they would still exist just be invisible.
function clearPlinkos() {
    plinkos.forEach((x) => {
        World.remove(world, x.body);
    });
    plinkos = [];
}

//Resetting the plinkos back to original
function resetPlinkos() {
    //clear the plinkos
    clearPlinkos();
    //establish how many plinkos we need per row and column
    let spacewidth = width / cols;
    let spaceheight = height / rows;
    //loop over all options and then create plinkos with enough space in between rows and columns so that they all fit
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols + 1; j++) {
            let x = j * spacewidth;
            if (i % 2 == 0) {
                x += spacewidth / 2;
            }

            let y = spacewidth + i * spaceheight;
            if (y < height - 100) {
                let plinkoR = random(plinkoMinSize, plinkoMaxSize);

                let plinko = new Plinko(x, y, plinkoR);
                plinkos.push(plinko);
            }
        }
    }
}

//draw function
function draw() {
    //websites background color
    background("#363636");
    // console.log(frameRate())
    //if we aren't plinko playing, clear
    if (!plinkoPlay) {
        Engine.clear(engine);
    } else {
        //Otherwise run it at 60 fps (if possible)
        Engine.update(engine, 1000 / 60);
    }

    //For all particles
    for (let i = 0; i < p.length; i++) {
        //draw it
        p[i].show();
        //check if its off screen
        if (p[i].isOffScreen()) {
            World.remove(world, p[i].body);
            p.splice(i, 1);
            i--;
        }
        //Otherwise grab the position
        let x = p[i]?.body?.position?.x;
        let y = p[i]?.body?.position?.y;

        //If we are at the end of the board, update the player's shot 
        //Each particle contains players values
        if (y > windowHeight - 308) {
            if (x <= width / 3) {
                players[p[i].player - 1]?.updateShots("addition");
            } else if (x >= width - width / 3) {
                players[p[i].player - 1]?.updateShots("multiplication");
            } else {
                players[p[i].player - 1]?.updateShots("fire");
            }
            World.remove(world, p[i].body);
            p.splice(i, 1);
            i--;
        }
    }

    //Show all plinkos
    for (let i = 0; i < plinkos.length; i++) {
        plinkos[i].show();
    }

    //Show all bounds (some are out of bounds of the canvas)
    for (let i = 0; i < bounds.length; i++) {
        bounds[i].show();
    }
}

//initial set up
function windowSetup() {
    //establish a gravity for the world
    world.gravity.y = gravity;
    //reset the plinkos
    resetPlinkos();
    //clear boundaries
    clearBoundrys();
    //remake the bottom boundary
    bottomB = new Boundry(width / 2, height + 50, width, 100);
    bounds.push(bottomB);

    // remake the walls out of bounds
    wallLeft = new Boundry(-5, 0, 2, height * 2);
    bounds.push(wallLeft);

    wallRight = new Boundry(width + 5, 0, 2, height * 2);
    bounds.push(wallRight);

    //position the bottom buckets in the right position (so 4 walls to make 3 buckets).
    for (let i = 0; i < 4; i++) {
        let w = 4;
        let h = 80;
        let x = (i * width) / 3;
        let y = height - h / 2;
        if (i === 0) {
            x -= 10;
        }
        if (i === 3) {
            x += 10;
        }
        let bucket = new Boundry(x, y, w, h);
        bounds.push(bucket);
    }
}

//Resize function to update the height mostly. 
function windowResized() {
    resizeCanvas(240, windowHeight - 300);
    //rerun setup
    windowSetup();
}

//resize and call this function only after 100ms since the last one.
let limit;
window.addEventListener("resize", () => {
    clearTimeout(limit);
    limit = setTimeout(windowResized, 100);
});

