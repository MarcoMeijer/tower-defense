
function transpose(arr) {
  const n = arr.length;
  const m = arr[0].length;
  const res = [];
  for (let j = 0; j < m; j++) {
    res.push([]);
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      res[j].push(arr[i][j]);
    }
  }
  return res;
}

export const tiles = transpose([
  "................",
  ".....2--3.......",
  ".....|..|.......",
  "-----1..|.......",
  "........|...2---",
  "...2----1...|...",
  "...|........|...",
  "...4--------1...",
  "................",
]);

export const enemyStart = {
  x: 0,
  y: 3,
};

function findPath() {
  const result = [];

  const n = tiles.length;
  const m = tiles[0].length;

  let x = enemyStart.x;
  let y = enemyStart.y;
  let dx = 0;
  let dy = 0;
  if (x == 0) dx = 1;
  if (y == 0) dy = 1;
  if (x == n - 1) dx = -1;
  if (y == m - 1) dy = -1;

  result.push({ x: x - dx, y: y - dy });
  while (x >= 0 && y >= 0 && x < n && y < m) {
    result.push({ x, y });
    if (tiles[x][y] == '1') {
      if (dx == 1) {
        dx = 0;
        dy = -1;
      } else {
        dx = -1;
        dy = 0;
      }
    }
    if (tiles[x][y] == '2') {
      if (dx == -1) {
        dx = 0;
        dy = 1;
      } else {
        dx = 1;
        dy = 0;
      }
    }
    if (tiles[x][y] == '3') {
      if (dx == 1) {
        dx = 0;
        dy = 1;
      } else {
        dx = -1;
        dy = 0;
      }
    }
    if (tiles[x][y] == '4') {
      if (dx == -1) {
        dx = 0;
        dy = -1;
      } else {
        dx = 1;
        dy = 0;
      }
    }
    x += dx;
    y += dy;
  }

  result.push({ x: x + dx, y: y + dy });
  return result;
}

export const path = findPath();

console.log(path);
