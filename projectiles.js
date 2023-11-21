
export const projectiles = [];

export function updateProjectile(projectile, dt) {
  const { x, y, targetX, targetY, timeRemaining } = projectile;
  const dx = dt * (targetX - x) / timeRemaining;
  const dy = dt * (targetY - y) / timeRemaining;
  projectile.x += dx;
  projectile.y += dy;
  projectile.timeRemaining -= dt;
}
