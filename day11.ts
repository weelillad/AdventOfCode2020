interface FerrySeat {
  seatOccupied: boolean;
  neighbourSeatIndices: Array<number>;
}

const CARDINAL_DIRECTIONS = ['NW', 'N', 'NE', 'W', 'E', 'SW', 'S', 'SE'] as const;
type cardinalDirections = typeof CARDINAL_DIRECTIONS[number];
function isCardinalDirection(str: string): str is cardinalDirections {
  return CARDINAL_DIRECTIONS.includes(str as cardinalDirections);
}

function parseSeatLayout(floorLayout: string, maxNeighbourDistance?: number): Map<number, FerrySeat> {
  const seatRowArray = floorLayout.split('\n');
  // width must factor in the '\n' at the end of every row
  const width = seatRowArray[0].length + 1, height = seatRowArray.length;

  const seatMap: Map<number, FerrySeat> = new Map();
  floorLayout.split('').forEach((char, index) => {
    if (char === 'L') {
      seatMap.set(index, {
        seatOccupied: false,
        neighbourSeatIndices: getVisibleSeatIndices(floorLayout, index, width, maxNeighbourDistance)
      });
    }
  });
  return seatMap;
}

function getVisibleSeatIndices(floorLayout: string, seatIndex: number, width: number, visibleDistance?: number): Array<number> {
  const indexArray: Array<number> = [];

  const colIndex = seatIndex % width;
  const vectorNums = {
    'NW': -width - 1,
    'N': -width,
    'NE': -width + 1,
    'W': -1,
    'E': +1,
    'SW': width - 1,
    'S': width,
    'SE': width + 1
  }

  const scanForVisibleSeat = (vector: cardinalDirections) => {
    const vectorNum: number = vectorNums[vector];
    let pointer = seatIndex, colPointer = colIndex, distance = 0;
    while (true) {
      pointer += vectorNum;
      if (pointer < 0 || pointer >= floorLayout.length) return;

      // Track column index, stop once left or right edge is hit
      if (vector === 'NW' || vector === 'W' || vector === 'SW') colPointer--;
      if (vector === 'NE' || vector === 'E' || vector === 'SE') colPointer++;
      if (colPointer < 0 || colPointer >= width) return;

      // Track distance (if required), stop once distance exceeded
      distance++;
      if (visibleDistance && distance > visibleDistance) return;

      if (floorLayout[pointer] === 'L') {
        indexArray.push(pointer);
        return;
      }
    }
  };

  for (const dir in vectorNums) {
    if (isCardinalDirection(dir))
      scanForVisibleSeat(dir);
  }

  return indexArray;
}

function doMusicalChairsIteration(seatMap: Map<number, FerrySeat>, vacateThreshold: number): {newSeatMap: Map<number, FerrySeat>, gotChange: boolean} {
  const countOccupiedNeighbours = (querySeat: number): number => {
    return seatMap.get(querySeat)?.neighbourSeatIndices.reduce((occupiedCount, neighbourIndex) => {
      return seatMap.get(neighbourIndex)?.seatOccupied
        ? occupiedCount + 1
        : occupiedCount;
    }, 0) ?? 0;
  }

  const newSeatMap: Map<number, FerrySeat> = new Map();
  let gotChange = false;

  for (const [seatIndex, seat] of seatMap) {
    if (seat.seatOccupied && countOccupiedNeighbours(seatIndex) >= vacateThreshold) {
      newSeatMap.set(seatIndex, { ...seat, seatOccupied: false });
      gotChange = true;
    }
    else if (!seat.seatOccupied && countOccupiedNeighbours(seatIndex) === 0) {
      newSeatMap.set(seatIndex, { ...seat, seatOccupied: true });
      gotChange = true;
    }
    else
      newSeatMap.set(seatIndex, seat);
  }
  return { newSeatMap, gotChange };
}

function getSteadyOccupiedSeatCount(seatMap: Map<number, FerrySeat>, vacateThreshold: number): number {
  let currSeatMap = seatMap
  do {
    const { newSeatMap, gotChange } = doMusicalChairsIteration(currSeatMap, vacateThreshold);
    currSeatMap = newSeatMap;
    if (!gotChange) break;
  } while (true);

  let occupiedSeatCount = 0;
  currSeatMap.forEach(seat => { if (seat.seatOccupied) occupiedSeatCount++; });
  return occupiedSeatCount;
}

const day11TestData: string =
  `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

function day11Test() {
  console.log("\nTEST\n");

  const seatMap1 = parseSeatLayout(day11TestData, 1);
  console.log(`PART 1: ${getSteadyOccupiedSeatCount(seatMap1, 4)}`);
  const seatMap2 = parseSeatLayout(day11TestData);
  console.log(`PART 2: ${getSteadyOccupiedSeatCount(seatMap2, 5)}`);
}

function day11() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input11.txt', 'utf8');

  console.log("\nACTUAL\n");

  const seatMap1 = parseSeatLayout(input, 1);
  console.log(`PART 1: ${getSteadyOccupiedSeatCount(seatMap1, 4)}`);
  const seatMap2 = parseSeatLayout(input);
  console.log(`PART 2: ${getSteadyOccupiedSeatCount(seatMap2, 5)}`);
}

day11Test();
day11();