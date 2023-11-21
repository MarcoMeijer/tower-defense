import { Ant, QueenAnt, enemies } from "./enemies.js";

export const waves = [
  wave1(),
  wave2(),
  wave3(),
  wave4(),
];

function wave1() {
  return [{
    enemies: [Ant],
    distance: 0.8,
    amount: 10,
    wait: 10,
  }];
}

function wave2() {
  return [
    {
      enemies: [Ant],
      distance: 0.5,
      amount: 10,
      wait: 1.5,
    },
    {
      enemies: [Ant],
      distance: 0.5,
      amount: 10,
      wait: 15,
    },
  ]
}

function wave3() {
  return [
    {
      enemies: [QueenAnt, Ant, Ant, Ant, Ant],
      distance: 0.9,
      amount: 15,
      wait: 15,
    }
  ]
}

function wave4() {
  return [
    {
      enemies: [QueenAnt],
      distance: 1.4,
      amount: 8,
      wait: 15,
    }
  ]
}

export const currentWave = {
  number: 0,
  group: 0,
  enemy: 0,
  timer: 0,
};

export function progressWave(delta) {
  currentWave.timer += delta;

  while (currentWave.number < waves.length) {
    const wave = waves[currentWave.number];

    // go to next wave
    if (currentWave.group == wave.length) {
      currentWave.number += 1;
      currentWave.group = 0;
      continue;
    }

    const group = wave[currentWave.group];

    // go to next group
    if (currentWave.enemy == group.amount) {
      if (currentWave.timer < group.wait) {
        break;
      }
      currentWave.timer -= group.wait;
      currentWave.group++;
      currentWave.enemy = 0;
      continue;
    }

    // go to next enemy
    if (currentWave.timer < group.distance) {
      break;
    }

    currentWave.timer -= group.distance;
    const enemy = group.enemies[currentWave.enemy % group.enemies.length];
    enemies.push(enemy());
    currentWave.enemy++;
  }
}
