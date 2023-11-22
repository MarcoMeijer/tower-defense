import { path } from "./map.js";
import { createElementFromHTML } from "./util.js";

export function Ant() {
  return {
    name: "Ant",
    cost: 5,
    tile: 16,
    speed: 0.5,
    health: 1,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 5,
  };
}

export function QueenAnt() {
  return {
    name: "Queen ant",
    cost: 25,
    tile: 17,
    speed: 0.5,
    health: 4,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 25,
  };
}

export function Bee() {
  return {
    name: "Bee",
    cost: 10,
    tile: 18,
    speed: 1,
    health: 1,
    x: path[0].x * 24,
    y: path[0].y * 24,
    pathPart: 0,
    reward: 10,
  };
}

export function updateEnemy(enemy) {
  const { pathPart, speed } = enemy;

  if (enemy.pathPart == path.length) {
    return;
  }

  const { x, y } = path[pathPart];
  const targetX = x * 24;
  const targetY = y * 24;
  if (targetX > enemy.x) {
    enemy.x += speed;
  }
  if (targetX < enemy.x) {
    enemy.x -= speed;
  }
  if (targetY > enemy.y) {
    enemy.y += speed;
  }
  if (targetY < enemy.y) {
    enemy.y -= speed;
  }
  if (targetX == enemy.x && targetY == enemy.y) {
    enemy.pathPart += 1;
  }
}

export const enemyTypes = [Ant, QueenAnt, Bee];

export function createEnemyUi(state, socket) {
  const enemiesElement = document.querySelector("#enemies");
  for (let i = 0; i < enemyTypes.length; i++) {
    const { name, cost, tile } = enemyTypes[i]();
    const tileX = tile % 8;
    const tileY = Math.floor(tile / 8);
    const enemy = createElementFromHTML(`
    <div class="enemy">
      <div class="towerImage" style="background-position-x: -${tileX * 24 * 4}px; background-position-y: -${tileY * 24 * 4}px;"></div>
      <h2>${name}</h2>
      <h3>$${cost}</h3>
    </div>
    `);

    enemy.addEventListener("click", () => {
      console.log("click");
      console.log(state);
      if (state.money >= cost) {
        state.money -= cost;
        socket.send(JSON.stringify({ type: "send", name }));
      }
    });
    enemiesElement.appendChild(enemy);
  }
}
