class PlacementTile {
  constructor(x, y) {
    this.position = {
      x,
      y
    };
    this.width = 32;
    this.height = 32;
    this.occupied = false;
  }

  update() {
    if (mouse.x >= this.position.x && mouse.x <= this.position.x + this.width &&
        mouse.y >= this.position.y && mouse.y <= this.position.y + this.height) {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
          ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
          // console.log('im in mouse if');
    }
  }
}