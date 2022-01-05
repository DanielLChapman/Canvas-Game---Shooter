function Particle(x,y,r, player, color){
  this.color = color;
  options = {
    restitution: 0.6,
    friction: 0
  }
  x += random(1,-1)
  this.body = Bodies.circle(x,y,r,options);
  this.r = r;
  this.body.label = 'particle';
  World.add(world, this.body);
  this.player = player;
}

Particle.prototype.isOffScreen = function(){
  let x = this.body.position.x;
  let y = this.body.position.y;
  return(x > width + 50 || x < -50 || y > height)
}

Particle.prototype.show = function(){

  let pos = this.body.position;
  fill(this.color);
  noStroke();
  push();
  translate(pos.x,pos.y);
  ellipse(0,0,this.r*2);
  pop();

}