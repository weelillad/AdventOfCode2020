interface Day20Tile {
  id: number;
  dim: number;
  rawImage: string;
  edgeN: string;
  edgeS: string;
  edgeE: string;
  edgeW: string;
  neighbourN?: number;
  neighbourS?: number;
  neighbourE?: number;
  neighbourW?: number;
}

function parseTiles(input: string): Array<Day20Tile> {
  const tileObjects: Array<Day20Tile> = [];

  input.split('\n\n').forEach(tileStr => {
    const [tileInfo, ...lines] = tileStr.split('\n');
    const id = parseInt(tileInfo.substring(5, tileInfo.length - 1));
    const dim = lines.length;
    const rawImage = lines.join('\n');
    const edgeN = lines[0];
    const edgeS = lines[dim - 1];
    const edgeW = lines.reduce((borderStr, line) => borderStr + line[0], '');
    const edgeE = lines.reduce((borderStr, line) => borderStr + line[dim - 1], '');

    tileObjects.push({ id, dim, rawImage, edgeN, edgeS, edgeW, edgeE });
  })

  // console.log(tileObjects[0]);
  return tileObjects;
}

function assembleTiles(tileObjects: Array<Day20Tile>) {
  // const edgeNMap: Map<string, Array<number>> = new Map();
  // const edgeSMap: Map<string, Array<number>> = new Map();
  // const edgeEMap: Map<string, Array<number>> = new Map();
  // const edgeWMap: Map<string, Array<number>> = new Map();
  // tileObjects.forEach(tile => {
  //   edgeNMap.get(tile.edgeN)?.push(tile.id) || edgeNMap.set(tile.edgeN, [tile.id]);
  //   edgeSMap.get(tile.edgeS)?.push(tile.id) || edgeSMap.set(tile.edgeS, [tile.id]);
  //   edgeEMap.get(tile.edgeE)?.push(tile.id) || edgeEMap.set(tile.edgeE, [tile.id]);
  //   edgeWMap.get(tile.edgeW)?.push(tile.id) || edgeWMap.set(tile.edgeW, [tile.id]);
  // });
  // console.log(edgeNMap); console.log(edgeSMap); console.log(edgeEMap); console.log(edgeWMap);

  // tileObjects.forEach(tile => {
  //   tile.neighbourN = edgeSMap.get(tile.edgeN)?.[0];
  //   tile.neighbourS = edgeNMap.get(tile.edgeS)?.[0];
  //   tile.neighbourE = edgeWMap.get(tile.edgeE)?.[0];
  //   tile.neighbourW = edgeEMap.get(tile.edgeW)?.[0];
  // });

  const tileMap: Map<number, Day20Tile> = new Map();
  tileObjects.forEach(tile => tileMap.set(tile.id, tile));

  const imageDim = Math.pow(tileObjects.length, 0.5);
  // const imageMap: Array<Array<Day20Tile>> = new Array(imageDim);
  // for (let i = 0; i < imageDim; i++) {
  //   imageMap[i] = new Array();
  // }

  const reverseString = (str: string): string => str.split('').reverse().join('');
  const tileFlipH = (tile: Day20Tile) => {
    console.log('Flipping horizontally', tile.id)
    const holdingVar = tile.edgeN;
    tile.edgeN = tile.edgeS;
    tile.edgeS = holdingVar;
    tile.edgeE = reverseString(tile.edgeE);
    tile.edgeW = reverseString(tile.edgeW);
    let tempVar = tile.neighbourS;
    tile.neighbourS = tile.neighbourN;
    tile.neighbourN = tempVar;
    if (tile.neighbourE && tileMap.get(tile.neighbourE)) tileFlipH(tileMap.get(tile.neighbourE)!);
    if (tile.neighbourW && tileMap.get(tile.neighbourW)) tileFlipH(tileMap.get(tile.neighbourW)!);
    // TODO handle tile.rawImage
  }
  const tileFlipV = (tile: Day20Tile) => {
    console.log('Flipping vertically', tile.id)
    const holdingVar = tile.edgeE;
    tile.edgeE = tile.edgeW;
    tile.edgeW = holdingVar;
    tile.edgeN = reverseString(tile.edgeN);
    tile.edgeS = reverseString(tile.edgeS);
    let tempVar = tile.neighbourE;
    tile.neighbourE = tile.neighbourW;
    tile.neighbourW = tempVar;
    if (tile.neighbourN && tileMap.get(tile.neighbourN)) tileFlipV(tileMap.get(tile.neighbourN)!);
    if (tile.neighbourS && tileMap.get(tile.neighbourS)) tileFlipV(tileMap.get(tile.neighbourS)!);
    // TODO handle tile.rawImage
  }
  const tileRotateCW = (tile: Day20Tile) => {
    console.log('Rotating clockwise', tile.id)
    const holdingVar = tile.edgeE;
    tile.edgeE = tile.edgeN;
    tile.edgeN = reverseString(tile.edgeW);
    tile.edgeW = tile.edgeS;
    tile.edgeS = reverseString(holdingVar);
    tile.neighbourE = tile.neighbourN = tile.neighbourS = tile.neighbourW = undefined;
    // TODO handle tile.rawImage
  }
  const tileRotateCCW = (tile: Day20Tile) => {
    console.log('Rotating counter-clockwise', tile.id)
    const holdingVar = tile.edgeE;
    tile.edgeE = reverseString(tile.edgeS);
    tile.edgeS = tile.edgeW;
    tile.edgeW = reverseString(tile.edgeN);
    tile.edgeN = holdingVar;
    tile.neighbourE = tile.neighbourN = tile.neighbourS = tile.neighbourW = undefined;
    // TODO handle tile.rawImage
  }
  const tileUpsideDown = (tile: Day20Tile) => {
    console.log('Rotating 180', tile.id)
    let holdingVar = tile.edgeE;
    tile.edgeE = reverseString(tile.edgeW);
    tile.edgeW = reverseString(holdingVar);
    holdingVar = tile.edgeN;
    tile.edgeN = reverseString(tile.edgeS);
    tile.edgeS = reverseString(holdingVar);
    tile.neighbourE = tile.neighbourN = tile.neighbourS = tile.neighbourW = undefined;
    tile.rawImage = reverseString(tile.rawImage);
  }

  let focusTile: Day20Tile | undefined = tileObjects[0];
  const tileArray = [focusTile];
  let count = 1;
  let matchFound = true;
  while (matchFound && tileArray.length < imageDim) {
    // imageMap[0].push(focusTile);
    matchFound = false;
    const reverseEdgeE = reverseString(focusTile.edgeE);
    for (const tile of tileObjects) {
      if (tile.id === focusTile.id) continue;
      if (tile.edgeW === focusTile.edgeE) {
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeW === reverseEdgeE) {
        tileFlipH(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeE === focusTile.edgeE) {
        tileFlipV(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeE === reverseEdgeE) {
        tileUpsideDown(tile)
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeN === focusTile.edgeE) {
        tileFlipV(tile);
        tileRotateCCW(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeN === reverseEdgeE) {
        tileRotateCCW(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeS === focusTile.edgeE) {
        tileRotateCW(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      } else if (tile.edgeS === reverseEdgeE) {
        tileRotateCW(tile);
        tileFlipH(tile);
        focusTile.neighbourE = tile.id;
        focusTile = tile;
        tileArray.push(tile);
        count++;
        matchFound = true;
        break;
      }
    }
    // const rightTileID = edgeWMap.get(focusTile.edgeE)?.[0] ?? -1
    // if (rightTileID) focusTile = tileMap.get(rightTileID);
  }
  console.log(tileArray);
  // let leftTileID = edgeEMap.get(imageMap[0][0].edgeW)?.[0] ?? -1;
  // nextTile = tileMap.get(leftTileID);
  // while (nextTile && imageMap[0].length < imageDim) {
  //   imageMap[0].push(nextTile);
  //   const rightTileID = edgeWMap.get(nextTile.edgeE)?.[0] ?? -1
  //   if (rightTileID) nextTile = tileMap.get(rightTileID);
  // }

}

function runDay20Logic(input: string) {
  const tileObjects = parseTiles(input);
  assembleTiles(tileObjects);
  // console.log(`Part 1: ${countRuleMatches(rulesMap, messages.split('\n'))}`);

  // rulesMap.set(8, ['42', '42 8']);
  // rulesMap.set(11, ['42 31', '42 11 31']);
  // console.log(`Part 2: ${countRuleMatches(rulesMap, messages.split('\n'))}`);
}

const day20TestData: string =
  `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

function day20Test() {
  console.log("\nTEST\n");

  runDay20Logic(day20TestData);
}

function day20() {
  const input: string = require('fs').readFileSync('./input20.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay20Logic(input);
}

day20Test();
day20();
