
export function newGame() {
  return {
    money: 1500,
    health: 100,
    towerSelected: -1,
    enemies: [],
    towers: [],
    projectiles: [],
    currentWave: {
      started: false,
      number: 0,
      group: 0,
      enemy: 0,
      timer: 0,
    },
    waveBonus: 10,
  };
}
