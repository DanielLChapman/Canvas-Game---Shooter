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
var p = [];
var plinkos = [];
var cols = 10;
var rows = 10;
var bounds = [];
var mConstraint;
var bottomB;
var canvas2;
var btn;
let plinkoMinSize = 1;
let plinkoMaxSize = 5;
let plinkoParticleSize = 6;
let gravity = 2;
let ownDrop = false;

function newParticle(_x, _y, i, color = "orange") {
    let pA = new Particle(_x, _y, plinkoParticleSize, i, color);
    // console.log(pA.body)
    p.push(pA);
}

function ownDropChange() {
    ownDrop = !ownDrop;
    if (ownDrop) {
        document.querySelector('#plinko-own-drop').innerHTML = "Dropping Your Own!"
    } else {
        document.querySelector('#plinko-own-drop').innerHTML = "Drop Your Own!"
    }
}

function setup() {
    colorMode(HSB);
    canvas2 = createCanvas(240, windowHeight - 300);
    canvas2.parent(document.querySelector(".plinko-container"));
    rows = Math.ceil(height / 50) + 2;
    engine = Engine.create();
    world = engine.world;

    btn = select("#btn");

    function collision(event) {
        /*       if (event.pairs.length >= 2) {
            var pairs = event.pairs;
            for(let i = 0; i < pairs.length;i++){
                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;
            }

        } */
        /*
    var pairs = event.pairs;
    for(let i = 0; i < pairs.length;i++){
      var bodyA = pairs[i].bodyA;
      var bodyB = pairs[i].bodyB;
      var idA = bodyA.id;
      var idB = bodyB.id;
      // console.log(idA);
      for(let i =0;i<plinkos.length;i++){
        if(plinkos[i].body.id == idA || plinkos[i].body.id ==idB){
          plinkos[i].shake();
          // console.log('change')
        }
      }

    }*/
    }

    Events.on(engine, "collisionStart", collision);

    windowSetup();

    var canvasmouse = Mouse.create(canvas2.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse,
    };

    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
}



function mousePressed() {
  
    let mouseXClick = mouseX;
    let mouseYClick = mouseY;
    if (ownDrop) {
        if (!(mouseXClick > width || mouseXClick < 0)) {
            if (!(mouseYClick > height - 80 || mouseYClick < 0)) {
                let color = `rgba(${Math.floor(random(0, 256))}, ${Math.floor(random(0, 256))},${Math.floor(random(0, 256))},1)`;
                let playerValueColor = Math.floor(random(1, 5));
                newParticle(
                    mouseX,
                    mouseY,
                    -1,
                    color
                );
            }
        }
    } else {
        /*     //will eventually be players left;
    for (let i = 1; i <= 4; i++) {
        newParticle(random(0, width), 0, i);
    } */

        //let plinko = new Plinko(mouseX, mouseY, random(10,16));
        //plinkos.push(plinko);

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

function clearBoundrys() {
    bounds.forEach((x) => {
        World.remove(world, x.body);
    });

    bounds = [];
}

function clearPlinkos() {
    plinkos.forEach((x) => {
        World.remove(world, x.body);
    });
    plinkos = [];
}

function resetPlinkos() {
    clearPlinkos();
    let spacewidth = width / cols;
    let spaceheight = height / rows;
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

function draw() {
    background("#363636");
    // console.log(frameRate())
    if (!plinkoPlay) {
        Engine.clear(engine);
    } else {
        Engine.update(engine, 1000 / 60);
    }

    for (let i = 0; i < p.length; i++) {
        p[i].show();
        if (p[i].isOffScreen()) {
            World.remove(world, p[i].body);
            p.splice(i, 1);
            i--;
        }
        let x = p[i]?.body?.position?.x;
        let y = p[i]?.body?.position?.y;

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

    for (let i = 0; i < plinkos.length; i++) {
        plinkos[i].show();
    }

    for (let i = 0; i < bounds.length; i++) {
        bounds[i].show();
    }

    if (mConstraint.body) {
        let pos = mConstraint.body.position;
        let offset = mConstraint.constraint.pointB;
        let m = mConstraint.mouse.position;
        // console.log(mConstraint.body)
        stroke(180, 255, 255);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
}

function windowSetup() {
    world.gravity.y = gravity;
    resetPlinkos();
    clearBoundrys();
    bottomB = new Boundry(width / 2, height + 50, width, 100);
    bounds.push(bottomB);

    // walls
    wallLeft = new Boundry(-5, 0, 2, height * 2);
    bounds.push(wallLeft);

    wallRight = new Boundry(width + 5, 0, 2, height * 2);
    bounds.push(wallRight);

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

function windowResized() {
    resizeCanvas(240, windowHeight - 300);
    rows = Math.ceil(height / 50) + 2;
    windowSetup();
}

let limit;
window.addEventListener("resize", () => {
    clearTimeout(limit);
    limit = setTimeout(windowResized, 100);
});

