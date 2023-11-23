import { Ant, Bee, QueenAnt, RedAnt, RedQueenAnt } from "./enemies.js";

export const waves = [
  wave1(),
  wave2(),
  wave3(),
  wave4(),
  wave5(),
  wave6(),
  wave7(),
  wave8(),
  wave9(),
  wave10(),
  wave11(),
  wave12(),
  wave13(),
  wave14(),
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

function wave5() {
  return [
    {
      enemies: [RedAnt],
      distance: 1,
      amount: 8,
      wait: 15,
    }
  ]
}

function wave6() {
  return [
    {
      enemies: [Ant],
      distance: 0.6,
      amount: 20,
      wait: 2,
    },
    {
      enemies: [RedAnt],
      distance: 0.4,
      amount: 10,
      wait: 15,
    }
  ]
}

function wave7() {
  return [
    {
      enemies: [RedAnt],
      distance: 0.4,
      amount: 40,
      wait: 10,
    },
  ]
}

function wave8() {
  return [
    {
      enemies: [RedAnt, Ant, Ant],
      distance: 0.3,
      amount: 20,
      wait: 1,
    },
    {
      enemies: [Ant, RedAnt, RedAnt],
      distance: 0.3,
      amount: 20,
      wait: 10,
    },
  ]
}

function wave9() {
  return [
    {
      enemies: [RedQueenAnt],
      distance: 0.5,
      amount: 1,
      wait: 10,
    },
  ]
}

function wave10() {
  return [
    {
      enemies: [RedAnt],
      distance: 0.2,
      amount: 25,
      wait: 10,
    },
  ]
}

function wave11() {
  return [
    {
      enemies: [RedAnt, RedAnt, RedAnt, RedAnt, RedQueenAnt],
      distance: 0.5,
      amount: 25,
      wait: 10,
    },
  ]
}

function wave12() {
  return [
    {
      enemies: [RedAnt, RedAnt, RedQueenAnt],
      distance: 0.5,
      amount: 30,
      wait: 1,
    },
    {
      enemies: [QueenAnt],
      distance: 0.5,
      amount: 20,
      wait: 10,
    },
  ]
}

function wave13() {
  return [
    {
      enemies: [Ant],
      distance: 0.15,
      amount: 40,
      wait: 1,
    },
    {
      enemies: [Bee],
      distance: 1,
      amount: 30,
      wait: 10,
    },
  ]
}

function wave14() {
  return [
    {
      enemies: [RedQueenAnt],
      distance: 1,
      amount: 5,
      wait: 1,
    },
    {
      enemies: [Bee],
      distance: 1,
      amount: 30,
      wait: 1,
    },
    {
      enemies: [RedQueenAnt],
      distance: 1,
      amount: 5,
      wait: 10,
    },
  ]
}

export function progressWave(state, delta) {
  const { currentWave } = state;
  if (!currentWave.started) {
    return;
  }

  currentWave.timer += delta;

  while (true) {
    const wave = waves[currentWave.number % waves.length];

    // go to next wave
    if (currentWave.group == wave.length) {
      currentWave.number += 1;
      currentWave.group = 0;
      state.money += state.waveBonus;
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
    state.enemies.push(enemy());
    currentWave.enemy++;
  }
}
