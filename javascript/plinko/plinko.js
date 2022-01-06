
function Plinko(x,y,r){

  options = {
    isStatic: true,
    restitution: 1,
    friction: 0
  }
  this.body = Bodies.circle(x,y,r,options);
  this.r = r;
  this.hue = random(360);
  this.sat = 0;
  this.bright = 0;
  this.offset = 0;
  this.body.label = 'plinko';
  World.add(world, this.body);
}

Plinko.prototype.show = function(){

  let pos = this.body.position;
  fill(this.hue, 255, 255);
  stroke(255);
  push();
  translate(pos.x,pos.y);
  ellipse(0+this.offset,0+this.offset,this.r*2);
  pop();

}

Plinko.prototype.shake = function(){
  this.offset = random(-3,3)
}

Plinko.prototype.changeColor = function(){
  this.hue = random(360);
  this.sat = 255;
  this.bright = 100;

}

