
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

