import { enemies } from "./enemies.js";
import { distance } from "./util.js";

export const towers = [];

export function updateTower(tower) {
  const { radius } = tower;
  for (const enemy of enemies) {
    if (distance(enemy, tower) < radius) {
      // shoot
      enemy.health -= 1;
      break;
    }
  }
}

export function createSunflower(x, y) {
  return {
    tile: 24,
    radius: 40,
    recharge: 2,
    x,
    y,
  };
}
