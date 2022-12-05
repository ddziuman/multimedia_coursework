class Enemy extends Sprite {
  constructor(x, y, width, height) {
    const source = 'img/enemies/blackPlane_1.png';
    super(x, y, width, height, source);

    this.radius = this.width / 2;

    this.velocity = {
      x: 0,
      y: 0
    };

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    },
    this.speed = 2;
    this.waypointID = 0;

    this.maxHealth = 100;
    this.currentHealth = this.maxHealth;
    
    this.moveAngle = 0; 
  }

  draw() {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.moveAngle);
    ctx.translate(-this.center.x, -this.center.y);
    super.draw();
    ctx.restore();

    // health bar
    ctx.fillStyle = 'white';
    ctx.fillRect(this.position.x, this.position.y - 5, this.width, this.height/5);
    ctx.fillStyle = 'green';
    ctx.fillRect(this.position.x, this.position.y - 5, this.width * (this.currentHealth/this.maxHealth), this.height/5);
  }

  update() {
    
    const waypoint = waypoints[this.waypointID];
    const dx = waypoint.x - this.center.x;
    const dy = waypoint.y - this.center.y;
    this.moveAngle = Math.atan2(dy, dx);

    this.draw();

   this.velocity.x = Math.cos(this.moveAngle) * this.speed;
   this.velocity.y = Math.sin(this.moveAngle) * this.speed;

   this.position.x += this.velocity.x;
   this.position.y += this.velocity.y;

   this.center.x = this.position.x + this.width / 2;
   this.center.y = this.position.y + this.height / 2;
   // If one step (this.velocity) is smaller then actual distance between Enemy and waypoint,
   // then it's time to go to the next waypoint.
   // Reason: this.center won't EVER be exactly equal to waypoint.position, 
   // if we are using speed multiplier
   if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < 
       Math.abs(this.velocity.x) &&
       Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
       Math.abs(this.velocity.y) && 
       this.waypointID < waypoints.length - 1) {
         this.waypointID++;
       }
  }
}