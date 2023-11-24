import { moveEnemy } from "./enemies.js";
import { createElementFromHTML, distance } from "./util.js";

function hasEffect(entity, effect) {
  for (const otherEffect of entity.effects) {
    if (otherEffect[0] == effect) {
      return true;
    }
  }
  return false;
}

function addEffect(entity, effect) {
  for (const otherEffect of entity.effects) {
    if (otherEffect[0] == effect[0]) {
      otherEffect[1] = Math.max(otherEffect[1], effect[1]);
      return;
    }
  }
  entity.effects.push([...effect]);
}

export function updateTower(state, tower, dt) {
  const { radius, tile, recharge, effects, damage, x, y, projectileRange } = tower;
  tower.timer += dt;

  if (tower.timer > recharge) {
    for (let i = 0; i < 2; i++) {
      for (const enemy of state.enemies) {
        if (distance(enemy, tower) >= radius) {
          continue;
        }

        if (enemy.futureHealth <= 0) {
          continue;
        }

        if (i == 0) {
          const cont = false;
          for (const effect of effects) {
            if (hasEffect(enemy, effect[0])) {
              cont = true;
              break;
            }
          }
          if (cont)
            continue;
        }

        // shoot
        for (const effect of effects) {
          addEffect(enemy, effect)
        }
        if (projectileRange == 0) {
          enemy.futureHealth -= damage;
        }
        const bulletSpeed = 0.2;
        const newEnemyPos = moveEnemy({ ...enemy }, bulletSpeed);

        state.projectiles.push({
          tile: tile + 8,
          x,
          y,
          targetX: newEnemyPos.x,
          targetY: newEnemyPos.y,
          timeRemaining: bulletSpeed,
          damage,
          range: projectileRange,
          target: enemy,
        });
        tower.timer = 0;
        return;
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
    projectileRange: 0,
    effects: [],
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
    recharge: 0.5,
    damage: 0,
    timer: 0,
    projectileRange: 0,
    effects: [["slow", 10]],
    x,
    y,
  };
}

export function IceCreamCone(x, y) {
  return {
    name: "Ice cream cone",
    cost: 400,
    tile: 26,
    radius: 50,
    recharge: 2,
    damage: 2,
    timer: 0,
    projectileRange: 12,
    effects: [],
    x,
    y,
  };
}

export function Cheese(x, y) {
  return {
    name: "Cheese",
    cost: 450,
    tile: 27,
    radius: 250,
    recharge: 4,
    damage: 8,
    timer: 0,
    effects: [],
    x,
    y,
  };
}

export const towerTypes = [Sunflower, HoneyBlaster, IceCreamCone, Cheese];

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
