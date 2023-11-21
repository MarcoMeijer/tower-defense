import { path } from "./map.js";

export function Ant() {
  return {
    tile: 16,
    speed: 0.5,
    health: 1,
    x: path[0].x * 16,
    y: path[0].y * 16,
    pathPart: 0,
  };
}

export function QueenAnt() {
  return {
    tile: 17,
    speed: 0.5,
    health: 4,
    x: path[0].x * 16,
    y: path[0].y * 16,
    pathPart: 0,
  };
}

export const enemies = [];

export function updateEnemy(enemy) {
  const { pathPart, speed } = enemy;
  const { x, y } = path[pathPart];
  const targetX = x * 16;
  const targetY = y * 16;
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

