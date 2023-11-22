import { updateEnemy } from "./enemies.js";
import { createTowerUi, towerTypes, updateTower } from "./towers.js";
import { path, tiles } from "./map.js";
import { progressWave } from "./waves.js";
import { updateProjectile } from "./projectiles.js";
import { newGame } from "./state.js";

const socket = new WebSocket("ws://localhost:9090/ws");

const myCanvas = document.querySelector("#myGame");
const opponentCanvas = document.querySelector("#opponentGame");

const myCtx = myCanvas.getContext("2d");
const opponentCtx = opponentCanvas.getContext("2d");

myCanvas.width = opponentCanvas.width = 384;
myCanvas.height = opponentCanvas.height = 216;

const myState = newGame();
const opponentState = newGame();

const ss = await loadImage("assets/spritesheet.png");

async function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = function() {
      resolve(image);
    }
    image.src = url;
  });
}

function drawTile(ctx, i, x, y) {
  const tileX = i % 8;
  const tileY = Math.floor(i / 8);
  ctx.drawImage(ss, tileX * 24, tileY * 24, 24, 24, Math.floor(x), Math.floor(y), 24, 24);
}

function drawBackground(ctx) {
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 9; j++) {
      if (tiles[i][j] == "-") {
        drawTile(ctx, 8, i * 24, j * 24);
      } else if (tiles[i][j] == "|") {
        drawTile(ctx, 9, i * 24, j * 24);
      } else if (tiles[i][j] == "1") {
        drawTile(ctx, 10, i * 24, j * 24);
      } else if (tiles[i][j] == "2") {
        drawTile(ctx, 11, i * 24, j * 24);
      } else if (tiles[i][j] == "3") {
        drawTile(ctx, 12, i * 24, j * 24);
      } else if (tiles[i][j] == "4") {
        drawTile(ctx, 13, i * 24, j * 24);
      } else {
        let tile = (i * 7 + j * 13) % 4;
        drawTile(ctx, tile, i * 24, j * 24);
      }
    }
  }
}

function drawEntity(ctx, entity) {
  const { tile, x, y } = entity;
  drawTile(ctx, tile, x, y);
}

export function drawRadius(ctx, tower) {
  let { x, y, radius } = tower;
  x += 12;
  y += 12;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

const moneyElement = document.querySelector("#money");
const livesElement = document.querySelector("#lives");

function draw(ctx, state) {

  // wave logic
  progressWave(state, 1 / 30);

  // update entities
  for (const enemy of state.enemies) {
    updateEnemy(enemy);
  }
  for (const tower of state.towers) {
    updateTower(state, tower, 1 / 30);
  }
  for (const projectile of state.projectiles) {
    updateProjectile(projectile, 1 / 30);
  }

  // kill enemies
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    if (state.enemies[i].health <= 0) {
      state.money += state.enemies[i].reward;
      state.enemies.splice(i, 1);
    } else if (state.enemies[i].pathPart == path.length) {
      state.health -= state.enemies[i].health;
      state.health = Math.max(state.health, 0);
      state.enemies.splice(i, 1);
    }
  }

  // remove projectiles
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    if (state.projectiles[i].timeRemaining <= 0) {
      state.projectiles.splice(i, 1);
    }
  }

  // rendering
  drawBackground(ctx);
  for (const enemy of state.enemies) {
    drawEntity(ctx, enemy);
  }
  for (const tower of state.towers) {
    drawEntity(ctx, tower);
  }
  for (const projectile of state.projectiles) {
    drawEntity(ctx, projectile);
  }

  if (state === myState) {
    livesElement.innerHTML = `Lives: ${state.health}`;
    moneyElement.innerHTML = `$${state.money}`;

    socket.send(JSON.stringify({ type: "update", state }));
  }

  window.requestAnimationFrame(() => draw(ctx, state));
}

myCanvas.addEventListener('click', function(event) {
  if (myState.towerSelected == -1)
    return;

  const canvasLeft = myCanvas.offsetLeft + myCanvas.clientLeft;
  const canvasTop = myCanvas.offsetTop + myCanvas.clientTop;
  const x = event.pageX - canvasLeft;
  const y = event.pageY - canvasTop;

  const tileX = Math.floor(x / 48);
  const tileY = Math.floor(y / 48);
  const tower = towerTypes[myState.towerSelected](tileX * 24, tileY * 24);
  if (tiles[tileX][tileY] == "." && myState.money >= tower.cost) {
    myState.money -= tower.cost;
    myState.towers.push(tower);
    tiles[tileX][tileY] = "X";
  }
});

function handleEvent(event) {
  console.log(event);
  if (event.type === "start") {
    myState.currentWave.started = true;
    opponentState.currentWave.started = true;
    draw(myCtx, myState);
    draw(opponentCtx, opponentState);
    createTowerUi(myState);

  }
  if (event.type === "update") {
    if (myState.currentWave.started === false) {
      myState.currentWave.started = true;
      opponentState.currentWave.started = true;
      draw(myCtx, myState);
      draw(opponentCtx, opponentState);
      createTowerUi(myState);
    }
    opponentState.towers = event.state.towers;
  }
}

socket.onopen = function() {
  console.log("[open] Connection established");
  console.log("Sending to server");
};

socket.onmessage = function(event) {
  try {
    const message = JSON.parse(event.data);
    handleEvent(message);
  } catch (err) {
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log(error)
};

