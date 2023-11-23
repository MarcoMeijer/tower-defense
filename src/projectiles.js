import { distance } from "./util.js";

export function updateProjectile(state, projectile, dt) {
  const { x, y, targetX, targetY, timeRemaining, range, damage, target } = projectile;
  const dx = dt * (targetX - x) / timeRemaining;
  const dy = dt * (targetY - y) / timeRemaining;
  projectile.x += dx;
  projectile.y += dy;
  projectile.timeRemaining -= dt;
  if (projectile.timeRemaining <= 0) {
    if (range > 0) {
      for (const enemy of state.enemies) {
        if (distance(enemy, projectile) < range) {
          enemy.health -= damage;
        }
      }
    } else {
      target.health -= damage;
    }
  }
}
