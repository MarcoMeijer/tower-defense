import { enemyStart } from "./map.js";

export function createAnt() {
  return {
    tile: 16,
    x: enemyStart.x * 16,
    y: enemyStart.y * 16,
    health: 20,
  };
}

export const enemies = [];

export function updateEnemy(enemy) {
  enemy.x += 1;
}

