import { createEnemyUi, enemyTypes, updateEnemy } from "./enemies.js";
import { createTowerUi, towerTypes, updateTower } from "./towers.js";
import { path, tiles } from "./map.js";
import { progressWave } from "./waves.js";
import { updateProjectile } from "./projectiles.js";
import { newGame } from "./state.js";

const usernameForm = document.querySelector(".usernameForm");
const loadingElement = document.querySelector(".loading");
const contentElement = document.querySelector(".content");
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

function draw(canvas, ctx, state, lastUpdate, socket) {
  const now = Date.now();
  const dt = (now - lastUpdate) / 1000 * 3;

  // wave logic
  progressWave(state, dt);

  // update entities
  for (const enemy of state.enemies) {
    updateEnemy(enemy, dt);
  }
  for (const tower of state.towers) {
    updateTower(state, tower, dt);
  }
  for (const projectile of state.projectiles) {
    updateProjectile(projectile, dt);
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

  const gameDiv = canvas.parentNode;
  const moneyElement = gameDiv.querySelector(".money");
  const livesElement = gameDiv.querySelector(".lives");
  const waveText = gameDiv.querySelector(".waveNumber");

  livesElement.innerText = `Lives: ${state.health}`;
  moneyElement.innerText = `$${state.money}`;
  waveText.innerText = `Wave: ${state.currentWave.number + 1}`;

  if (socket) {
    socket.send(JSON.stringify({ type: "update", state }));
  } else {
    const username = document.querySelector(".username");
    username.innerText = `${state.username}:`;
  }

  window.requestAnimationFrame(() => draw(canvas, ctx, state, now, socket));
}

myCanvas.addEventListener('click', function(event) {
  if (myState.towerSelected == -1)
    return;

  const origin = myCanvas.parentNode;
  const canvasLeft = origin.offsetLeft + origin.clientLeft;
  const canvasTop = origin.offsetTop + origin.clientTop;
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

function startGame(socket) {
  console.log("start game");
  myState.currentWave.started = true;
  opponentState.currentWave.started = true;
  draw(myCanvas, myCtx, myState, Date.now(), socket);
  draw(opponentCanvas, opponentCtx, opponentState, Date.now());
  createTowerUi(myState);
  createEnemyUi(myState, socket);
  loadingElement.classList.add("hidden");
  contentElement.classList.remove("hidden");
}

function handleEvent(socket, event) {
  if (event.type === "start") {
    startGame(socket);
  }
  if (event.type === "update") {
    if (myState.currentWave.started === false) {
      startGame(socket);
    }
    for (const key in event.state) {
      opponentState[key] = event.state[key];
    }
  }
  if (event.type === "send") {
    const { name } = event;
    for (const enemyFactory of enemyTypes) {
      const enemy = enemyFactory();
      if (enemy.name === name) {
        myState.enemies.push(enemy);
      }
    }
  }
}

function openSocket() {
  const socket = new WebSocket("wss://seahorse-app-jn2bg.ondigitalocean.app/ws");

  socket.onopen = function() {
    console.log("[open] Connection established");
  };

  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    handleEvent(socket, message);
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

}

const form = document.querySelector("form");

form.addEventListener('submit', (event) => {
  event.preventDefault();
  usernameForm.classList.add("hidden");
  loadingElement.classList.remove("hidden");
  openSocket();

  const formData = new FormData(event.target);
  const formProps = Object.fromEntries(formData);
  myState.username = formProps.username;

  form.reset();
});

