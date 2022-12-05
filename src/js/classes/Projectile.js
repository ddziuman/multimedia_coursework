class Projectile extends Sprite {
  constructor(x, y, width, height, enemy) {
    const source = 'img/projectile.png';
    super(x, y, width, height, source, 4);

    this.velocity = {
      x: 0,
      y: 0
    };
    this.radius = this.width / 2;
    this.enemy = enemy;
    this.power = 3;
    this.damage = 20;
  }

  update() {
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y, 
      this.enemy.center.x - this.position.x
    );

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);
    ctx.translate(-this.position.x, -this.position.y);
    this.draw();
    ctx.restore();

    this.velocity.x = Math.cos(angle);
    this.velocity.y = Math.sin(angle);

    this.position.x += this.velocity.x * this.power;
    this.position.y += this.velocity.y * this.power;
  }
}