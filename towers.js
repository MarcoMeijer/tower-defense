import { enemies } from "./enemies.js";
import { projectiles } from "./projectiles.js";
import { distance } from "./util.js";

export const towers = [];

export function updateTower(tower, dt) {
  const { radius, tile, recharge, x, y } = tower;
  tower.timer += dt;

  if (tower.timer > recharge) {
    for (const enemy of enemies) {
      if (distance(enemy, tower) < radius) {
        // shoot
        enemy.health -= 1;
        projectiles.push({
          tile: tile + 8,
          x,
          y,
          targetX: enemy.x,
          targetY: enemy.y,
          timeRemaining: 0.4,
        });
        tower.timer = 0;
        break;
      }
    }
  }
}

export function Sunflower(x, y) {
  return {
    name: "Sunflower",
    cost: 150,
    tile: 24,
    radius: 40,
    recharge: 1,
    damage: 1,
    timer: 0,
    x,
    y,
  };
}

export function HoneyBlaster(x, y) {
  return {
    name: "Honey blaster",
    cost: 250,
    tile: 25,
    radius: 60,
    recharge: 2,
    damage: 1,
    timer: 0,
    x,
    y,
  };
}

export const TowerTypes = [Sunflower, HoneyBlaster];

function createTowerUi() {
  const towersElement = document.querySelector("#towers");
  for (const towerFactory of TowerTypes) {
    const { name, cost, recharge, radius, damage, tile } = towerFactory();
    const tileX = tile % 8;
    const tileY = Math.floor(tile / 8);
    towersElement.innerHTML += `
    <div>
        <div class="tower">
          <div class="towerImage" style="background-position-x: -${tileX * 24 * 4}px; background-position-y: -${tileY * 24 * 4}px;"></div>
          <h2>${name}</h2>
          <h3>$${cost}</h3>
          <p>Attack speed: ${1 / recharge}</p>
          <p>Range: ${radius}</p>
          <p>Damage: ${damage}</p>
        </div>
    </div>
    `
  }
}

createTowerUi();
