import { enemies, updateEnemy } from "./enemies.js";
import { createSunflower, towers, updateTower } from "./towers.js";
import { tiles } from "./map.js";
import { progressWave } from "./waves.js";
import { projectiles, updateProjectile } from "./projectiles.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ss = await loadImage("spritesheet.png");

canvas.width = 256;
canvas.height = 144;

async function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = function() {
      resolve(image);
    }
    image.src = url;
  });
}

function drawTile(i, x, y) {
  const tileX = i % 8;
  const tileY = Math.floor(i / 8);
  ctx.drawImage(ss, tileX * 16, tileY * 16, 16, 16, Math.floor(x), Math.floor(y), 16, 16);
}

function drawBackground() {
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 9; j++) {
      if (tiles[i][j] == "-") {
        drawTile(8, i * 16, j * 16);
      } else if (tiles[i][j] == "|") {
        drawTile(9, i * 16, j * 16);
      } else if (tiles[i][j] == "1") {
        drawTile(10, i * 16, j * 16);
      } else if (tiles[i][j] == "2") {
        drawTile(11, i * 16, j * 16);
      } else if (tiles[i][j] == "3") {
        drawTile(12, i * 16, j * 16);
      } else if (tiles[i][j] == "4") {
        drawTile(13, i * 16, j * 16);
      } else {
        drawTile(0, i * 16, j * 16);
      }
    }
  }
}

function drawEntity(entity) {
  const { tile, x, y } = entity;
  drawTile(tile, x, y);
}

export function drawRadius(tower) {
  let { x, y, radius } = tower;
  x += 8;
  y += 8;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function draw() {

  progressWave(1 / 30);

  for (const enemy of enemies) {
    updateEnemy(enemy);
  }
  for (const tower of towers) {
    updateTower(tower, 1 / 30);
  }
  for (const projectile of projectiles) {
    updateProjectile(projectile, 1 / 30);
  }

  // kill enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].health <= 0) {
      enemies.splice(i, 1);
    }
  }

  // remove projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].timeRemaining <= 0) {
      projectiles.splice(i, 1);
    }
  }

  // rendering
  drawBackground();
  for (const enemy of enemies) {
    drawEntity(enemy);
  }
  for (const tower of towers) {
    drawEntity(tower);
  }
  for (const projectile of projectiles) {
    drawEntity(projectile);
  }

  /*
  for (const tower of towers) {
    drawRadius(tower);
  }
  */

  window.requestAnimationFrame(draw);
}

draw();

canvas.addEventListener('click', function(event) {
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const x = event.pageX - canvasLeft;
  const y = event.pageY - canvasTop;

  const tileX = Math.floor(x / 48);
  const tileY = Math.floor(y / 48);
  if (tiles[tileX][tileY] == ".") {
    towers.push(createSunflower(tileX * 16, tileY * 16));
    tiles[tileX][tileY] = "X";
  }
});
