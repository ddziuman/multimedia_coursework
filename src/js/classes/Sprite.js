class Sprite {
  constructor(x, y, width, height, src, spritesCount = 1, offset = {x: 0, y: 0}) {
    this.position = {
      x,
      y
    };
    this.width = width;
    this.height = height;
    // this.offset = offset;
    this.position.x += offset.x;
    this.position.y += offset.y;

    this.img = new Image();
    this.img.src = src;
    this.frames = {
      max: spritesCount,
      currentSpriteIndex: 0,

      framesPast: 0, // triggering new sprite every 'spritePeriod' frames (counting frames)
      spritePeriod: 5 // delay between previous and next sprite of animation to apeear (maybe delivered by constructor later!)
    };
  }

  draw() {
    const cropWidth = this.img.width / this.frames.max;
    const crop = {
      position: {
        x: cropWidth * this.frames.currentSpriteIndex,
        y: 0
      },
      width: cropWidth,
      height: this.img.height
    };


    ctx.drawImage( // crop API is a bit confusing:
      this.img,
      // on the image (crop)
      crop.position.x, 
      crop.position.y, 
      crop.width,
      crop.height, 
      // on the screen (render)
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    console.log(this.frames.currentSpriteIndex);

    // responsible for sprites animation (multiple sprites rendering)
    if (this.frames.framesPast % this.frames.spritePeriod === 0) {
      this.frames.currentSpriteIndex++;
      if (this.frames.currentSpriteIndex >= this.frames.max) { // 0, 1, 2, 3 => 0, 1, 2, 3 (4 frames)
        this.frames.currentSpriteIndex = 0;
      }
    }
    this.frames.framesPast++;
  }
}