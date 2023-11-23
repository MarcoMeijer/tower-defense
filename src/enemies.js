import { path } from "./map.js";
import { createElementFromHTML } from "./util.js";

export function Ant() {
  return {
    name: "Ant",
    cost: 20,
    tile: 16,
    speed: 25,
    health: 1,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 5,
    addedBonus: 1,
    effects: [],
  };
}

export function QueenAnt() {
  return {
    name: "Queen ant",
    cost: 100,
    tile: 17,
    speed: 25,
    health: 4,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 25,
    addedBonus: 3,
    effects: [],
  };
}

export function Bee() {
  return {
    name: "Bee",
    cost: 20,
    tile: 18,
    speed: 75,
    health: 1,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 10,
    addedBonus: 1,
    effects: [],
  };
}

export function updateEnemy(enemy, dt) {
  const { speed } = enemy;

  let dSpeed = speed * dt;

  for (const effect of enemy.effects) {
    effect[1] -= dt;
  }
  enemy.effects = enemy.effects.filter(effect => effect[1] >= 0);
  for (const effect of enemy.effects) {
    if (effect[0] === "slow") {
      dSpeed /= 2;
    }
  }

  while (dSpeed > 0) {
    if (enemy.pathPart == path.length) {
      return;
    }

    const { x, y } = path[enemy.pathPart];
    const targetX = x * 24;
    const targetY = y * 24;
    if (targetX > enemy.x) {
      if (targetX > enemy.x + dSpeed) {
        enemy.x += dSpeed;
        dSpeed = 0;
      } else {
        dSpeed -= targetX - enemy.x;
        enemy.x = targetX;
      }
    } else if (targetX < enemy.x) {
      if (targetX < enemy.x - dSpeed) {
        enemy.x -= dSpeed;
        dSpeed = 0;
      } else {
        dSpeed -= enemy.x - targetX;
        enemy.x = targetX;
      }
    } else if (targetY > enemy.y) {
      if (targetY > enemy.y + dSpeed) {
        enemy.y += dSpeed;
        dSpeed = 0;
      } else {
        dSpeed -= targetY - enemy.y;
        enemy.y = targetY;
      }
    } else if (targetY < enemy.y) {
      if (targetY < enemy.y - dSpeed) {
        enemy.y -= dSpeed;
        dSpeed = 0;
      } else {
        dSpeed -= enemy.y - targetY;
        enemy.y = targetY;
      }
    }
    if (targetX == enemy.x && targetY == enemy.y) {
      enemy.pathPart += 1;
    }
  }
}

export const enemyTypes = [Ant, QueenAnt, Bee];

export function createEnemyUi(state, socket) {
  const enemiesElement = document.querySelector("#enemies");
  for (let i = 0; i < enemyTypes.length; i++) {
    const { name, cost, tile, addedBonus } = enemyTypes[i]();
    const tileX = tile % 8;
    const tileY = Math.floor(tile / 8);
    const enemy = createElementFromHTML(`
    <div class="enemy">
      <div class="towerImage" style="background-position-x: -${tileX * 24 * 4}px; background-position-y: -${tileY * 24 * 4}px;"></div>
      <h2>${name}</h2>
      <h3>$${cost}</h3>
      <p>Wave bonus: +$${addedBonus}</p>
    </div>
    `);

    enemy.addEventListener("click", () => {
      if (state.money >= cost) {
        state.money -= cost;
        socket.send(JSON.stringify({ type: "send", name }));
      }
      state.waveBonus += addedBonus;
    });
    enemiesElement.appendChild(enemy);
  }
}
