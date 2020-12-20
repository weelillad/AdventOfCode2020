#!/usr/bin/env ts-node-script

function parseMap(mapString: Array<string>): Array<boolean> {
  const boolArray: Array<boolean> = [];
  mapString.forEach(mapline => {
    mapline.split('').forEach(char => {
      boolArray.push(char === '.' ? false : true);
    })
  });

  return boolArray;
}

// Assume zero-indexing
function translatePosToIndex(width: number, height: number, x: number, y: number): number {
  return ((y * width) + (x % width)) % (height * width);
}

function countCollisions(mapString: Array<string>, angleX: number, angleY: number): number {
  let currX = 0, currY = 0, collisionCount = 0;
  const mapWidth = mapString[0].length, mapHeight = mapString.length;
  const map = parseMap(mapString);

  while (currY < mapHeight) {
    const nextIndex = translatePosToIndex(mapWidth, mapHeight, currX, currY);
    if (map[nextIndex]) collisionCount++;
    currX += angleX;
    currY += angleY;
  }

  return collisionCount;
}

function day03Part1(mapStrings: Array<string>): number {
  return countCollisions(mapStrings, 3, 1);
}

function day03Part2(mapStrings: Array<string>): number {
  const treesR3D1 = countCollisions(mapStrings, 3, 1)
  console.log("R3D1: " + treesR3D1);
  const treesR1D1 = countCollisions(mapStrings, 1, 1)
  console.log("R1D1: " + treesR1D1);
  const treesR5D1 = countCollisions(mapStrings, 5, 1)
  console.log("R5D1: " + treesR1D1);
  const treesR7D1 = countCollisions(mapStrings, 7, 1)
  console.log("R7D1: " + treesR7D1);
  const treesR1D2 = countCollisions(mapStrings, 1, 2)
  console.log("R1D2: " + treesR1D2);
  return treesR3D1 * treesR1D1 * treesR5D1 * treesR7D1 * treesR1D2;
}

const day03TestMap: Array<string> = [
  "..##.......",
  "#...#...#..",
  ".#....#..#.",
  "..#.#...#.#",
  ".#...##..#.",
  "..#.##.....",
  ".#.#.#....#",
  ".#........#",
  "#.##...#...",
  "#...##....#",
  ".#..#...#.#"
];

function day03Test() {
  console.log("TEST");
  console.log("Part 1: " + day03Part1(day03TestMap));
  console.log("Part 2: " + day03Part2(day03TestMap));
}

function day03() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./Day03/input03.txt', 'utf8');
  const inputStrings = input.split('\n');

  console.log("ACTUAL");
  console.log("Part 1: " + day03Part1(inputStrings));
  console.log("Part 2: " + day03Part2(inputStrings));
}

day03Test();
day03();
