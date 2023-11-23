import { createElementFromHTML, distance } from "./util.js";

export function updateTower(state, tower, dt) {
  const { radius, tile, recharge, x, y } = tower;
  tower.timer += dt;

  if (tower.timer > recharge) {
    for (const enemy of state.enemies) {
      if (distance(enemy, tower) < radius) {
        // shoot
        enemy.health -= 1;
        state.projectiles.push({
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

export const towerTypes = [Sunflower, HoneyBlaster];

export function createTowerUi(state) {
  const towersElement = document.querySelector("#towers");
  for (let i = 0; i < towerTypes.length; i++) {
    const { name, cost, recharge, radius, damage, tile } = towerTypes[i]();
    const tileX = tile % 8;
    const tileY = Math.floor(tile / 8);
    const tower = createElementFromHTML(`
    <div class="tower" id="tower${i}">
      <div class="towerImage" style="background-position-x: -${tileX * 24 * 4}px; background-position-y: -${tileY * 24 * 4}px;"></div>
      <h2>${name}</h2>
      <h3>$${cost}</h3>
      <p>Attack speed: ${1 / recharge}</p>
      <p>Range: ${radius}</p>
      <p>Damage: ${damage}</p>
    </div>
    `);

    tower.addEventListener("click", () => {
      const prevSelected = document.querySelectorAll(".tower.selected");
      for (const selected of prevSelected) {
        selected.classList.remove("selected");
      }
      tower.classList.add("selected");
      state.towerSelected = i;
    });
    towersElement.appendChild(tower);
  }
}