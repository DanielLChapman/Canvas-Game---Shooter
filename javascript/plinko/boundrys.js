
function Boundry(x,y,w,h){
    options = {
      isStatic: true,
      friction: 0
    }
    this.w = w
    this.h = h
    this.body = Bodies.rectangle(x,y,w,h,options);
    World.add(world, this.body);
  }
  
  Boundry.prototype.show = function(){
  
    let pos = this.body.position;
    fill(255);
    stroke(255);
    push();
    rectMode(CENTER);
    translate(pos.x,pos.y);
    rect(0,0,this.w,this.h);
    pop();
  
  }
  
  