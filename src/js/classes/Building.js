class Building extends Sprite {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'img/turret.png', 1, {x: -width / 4, y: -height / 4});

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };

    this.projectiles = []; // позиция Projectile - центр Building;
    this.target = null; // Enemy, динамически установлено в animate() перед созданием Projectile

    this.attackRadius = 150;
    this.attackReload = 0;
    this.attackDelay = 50; // every 50 frame there's a new Projectile
  }

  draw() {
    super.draw();

    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.attackRadius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.target) {
      ctx.save();
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate(Math.abs(Math.PI));
      ctx.translate(-this.center.x, -this.center.y);
      this.draw();
      ctx.restore();
    } else {
      this.draw();
    }

    // console.log(this.attackReload);
    if (this.attackReload % this.attackDelay === 0 && this.target) {
      this.projectiles.push( 
        new Projectile(this.center.x, this.center.y, 20, 20, this.target)
      );
      this.attackReload = 0;
    }
                        // ситуация, когда враг выходит из радиуса атаки, нужно всё равно "закончить" перезарядку
    if (this.target || (!this.target && this.attackReload < this.attackDelay && this.attackReload !== 0)) { // перезарядка только тогда, когда "был выстрел" (этого не было в видосе)
      this.attackReload++;
    }
  }
}