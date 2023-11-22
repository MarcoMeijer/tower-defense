import { enemies, updateEnemy } from "./enemies.js";
import { towerTypes, towers, updateTower } from "./towers.js";
import { path, tiles } from "./map.js";
import { progressWave } from "./waves.js";
import { projectiles, updateProjectile } from "./projectiles.js";
import { state } from "./state.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ss = await loadImage("assets/spritesheet.png");

canvas.width = 384;
canvas.height = 216;

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
  ctx.drawImage(ss, tileX * 24, tileY * 24, 24, 24, Math.floor(x), Math.floor(y), 24, 24);
}

function drawBackground() {
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 9; j++) {
      if (tiles[i][j] == "-") {
        drawTile(8, i * 24, j * 24);
      } else if (tiles[i][j] == "|") {
        drawTile(9, i * 24, j * 24);
      } else if (tiles[i][j] == "1") {
        drawTile(10, i * 24, j * 24);
      } else if (tiles[i][j] == "2") {
        drawTile(11, i * 24, j * 24);
      } else if (tiles[i][j] == "3") {
        drawTile(12, i * 24, j * 24);
      } else if (tiles[i][j] == "4") {
        drawTile(13, i * 24, j * 24);
      } else {
        let tile = (i * 7 + j * 13) % 4;
        drawTile(tile, i * 24, j * 24);
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
  x += 12;
  y += 12;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

const moneyElement = document.querySelector("#money");
const livesElement = document.querySelector("#lives");

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
      state.money += enemies[i].reward;
      enemies.splice(i, 1);
    } else if (enemies[i].pathPart == path.length) {
      state.health -= enemies[i].health;
      state.health = Math.max(state.health, 0);
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

  livesElement.innerHTML = `Lives: ${state.health}`;
  moneyElement.innerHTML = `$${state.money}`;

  window.requestAnimationFrame(draw);
}

draw();

canvas.addEventListener('click', function(event) {
  if (state.selectedTower == -1)
    return;

  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const x = event.pageX - canvasLeft;
  const y = event.pageY - canvasTop;

  const tileX = Math.floor(x / 48);
  const tileY = Math.floor(y / 48);
  const tower = towerTypes[state.selectedTower](tileX * 24, tileY * 24);
  if (tiles[tileX][tileY] == "." && state.money >= tower.cost) {
    state.money -= tower.cost;
    towers.push(tower);
    tiles[tileX][tileY] = "X";
  }
});
