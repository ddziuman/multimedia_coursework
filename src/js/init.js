const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 640;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gameMap = new Image();
gameMap.src = 'img/map1_smaller.png';
gameMap.onload = () => {
  animate();// КАНВАС ОДНОСЛОЙНЫЙ! (перезапись пространства канваса, а не слой на слое)
}

const buildings = [];
const explosions = [];

const enemies = [];
let enemyCount = 3;
let enemyBounty = 100;

let passLives = Number(document.querySelector('#heartsCount').innerHTML);
let cash = Number(document.querySelector('#cash').innerHTML);
const buildingCost = 290;

function spawnEnemies(count) { // upgrade this method later! (not only increase count by 2, but also increase speed, etc.)
  for (let i = 1; i < count + 1; i++) {
    const offset = i * 75;
    enemies.push(new Enemy(waypoints[0].x - offset, waypoints[0].y, 25, 25));
  }
}
spawnEnemies(enemyCount);

document.querySelector('#alert').play(); // is ingored?

function animate() {
  console.log(explosions);
  const animationID = requestAnimationFrame(animate); // request animation loop (each animate() = 1 frame)
  ctx.drawImage(gameMap, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i]
    enemy.update();

    if (enemy.position.y > canvas.height) {
      console.log('decrease hearts, delete enemy');
      enemies.splice(i, 1);
      console.log('enemies length: ' + enemies.length);
      passLives--;
      document.querySelector('#heartsCount').innerHTML = passLives;
    }

    // tracking current game state (playing / over)
    if (passLives === 0) {
      console.log('game over');
      cancelAnimationFrame(animationID);
      document.querySelector('#gameOver').style.display = 'flex';
      document.querySelector('#alert').pause(); // is ignored?
    }

    // tracking waves spawn

  }

  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    explosion.draw();

    // if (explosion.frames.currentSpriteIndex >= explosion.frames.max - 1) {
    //   explosions.splice(i, 1);
    // }
    setTimeout(() => {
      explosions.splice(i, 1);
    }, 10000);
  }

  placementTiles.forEach(tile => {
    tile.update();
  });

  buildings.forEach(building => {
    building.update();

    building.target = null;
    const targetsInRadius = [];
    enemies.forEach(enemy => {
      const dx = enemy.center.x - building.center.x;
      const dy = enemy.center.y - building.center.y;
      const distance = Math.hypot(dx, dy);
      if (distance < building.attackRadius + enemy.radius) {
        targetsInRadius.push(enemy);
      }

      building.target = targetsInRadius[0]; // take the first enemy who passed the radius
    })

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();

      const dx = projectile.enemy.center.x - projectile.position.x;
      const dy = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(dx, dy);

      // the momemnt when Projectile hits an Enemy
      if (distance < projectile.radius + projectile.enemy.radius) {
        
        building.projectiles.splice(i, 1);

        // enemy health + removal processing
        projectile.enemy.currentHealth -= projectile.damage;
        if (projectile.enemy.currentHealth <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });
          explosions.push(new Sprite(
            projectile.position.x, 
            projectile.position.y,
            projectile.width * 2,
            projectile.height * 2,
            'img/burning_loop_1.png',
            8,
            {
              x: -projectile.radius,
              y: -projectile.radius
            }
          ));
          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
            cash += enemyBounty;
            document.querySelector('#cash').innerHTML = cash;
            console.log('enemy killed by projectile');
          }
        }
      }
      // console.log(distance);
    }
    // splice inside forEach flicker danger, so using basic 'for' loop instead of 'forEach'
  });

  if (enemies.length === 0) {
    enemyCount *= 2;
    spawnEnemies(enemyCount);
  }

}

const mouse = {
  x: null,
  y: null
};

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
});


canvas.addEventListener('click', (event) => {
  for (let i = 0; i < placementTiles.length; i++) {
    if (mouse.x >= placementTiles[i].position.x && mouse.x <= placementTiles[i].position.x + placementTiles[i].width &&
        mouse.y >= placementTiles[i].position.y && mouse.y <= placementTiles[i].position.y + placementTiles[i].height &&
        !placementTiles[i].occupied &&
        cash >= buildingCost) {
          cash -= buildingCost;
          document.querySelector('#cash').innerHTML = cash;
          buildings.push(new Building(placementTiles[i].position.x, placementTiles[i].position.y, 64, 32));
          placementTiles[i].occupied = true;
          // sorting buldings by Z-axis (not actually visible, but good practice)
          buildings.sort((a, b) => {
            return a.position.y - b.position.y;
          });
        
          break;
      }
  }
})