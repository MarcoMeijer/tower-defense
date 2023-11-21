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

export function createSunflower(x, y) {
  return {
    tile: 24,
    radius: 40,
    recharge: 1,
    timer: 0,
    x,
    y,
  };
}
