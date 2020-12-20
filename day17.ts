type Map3D = Map<number, Map<number, Map<number, boolean>>>;
type Map4D = Map<number, Map<number, Map<number, Map<number, boolean>>>>;

function print3DSpace(space: Map3D, step: number, initSize: number) {
  for (let z = -step; z <= step; z++) {
    console.log(`z=${z}`);
    const layerMap = space.get(z);
    for (let y = -step; y < initSize + step; y++) {
      let rowString = '';
      const rowMap = layerMap?.get(y);
      for (let x = -step; x < initSize + step; x++) {
        const isActive = rowMap?.get(x) ?? false;
        rowString += isActive
          ? '#'
          : '.';
      }
      console.log(rowString);
    }
    console.log('');
  }
}

function runDay17Part1Logic(input: string, numSteps: number): number {
  // Parse input
  const inputLines = input.split('\n');
  const initSize = inputLines.length;
  let space: Map3D = new Map();
  const zeroLayerMap = new Map();
  inputLines.forEach((line, y) => {
    const rowMap = new Map();
    line.split('').forEach((char, x) => {
      rowMap.set(x, char === '#');
    });
    zeroLayerMap.set(y, rowMap);
  });
  space.set(0, zeroLayerMap);
  // printSpace(space, 0, initSize);

  const processCell = (cellZ: number, cellY: number, cellX: number): boolean => {
    let activeNeighbourCount = 0;
    for (let z = cellZ - 1; z <= cellZ + 1; z++) {
      const layerMap = space.get(z);
      for (let y = cellY - 1; y <= cellY + 1; y++) {
        const rowMap = layerMap?.get(y);
        for (let x = cellX - 1; x <= cellX + 1; x++) {
          if (!!rowMap?.get(x)) activeNeighbourCount++;
        }
      }
    }
    const activity = space.get(cellZ)?.get(cellY)?.get(cellX) ?? false;
    if (activity) {
      activeNeighbourCount--; // don't count itself
      return (activeNeighbourCount === 2 || activeNeighbourCount === 3);
    }
    else
      return activeNeighbourCount === 3;
  };
  const processStep = (stepNum: number): Map3D => {
    const newSpace = new Map();
    for (let z = -stepNum; z <= stepNum; z++) {
      const newLayerMap = new Map();
      for (let y = -stepNum; y < initSize + stepNum; y++) {
        const newRowMap = new Map();
        for (let x = -stepNum; x < initSize + stepNum; x++) {
          newRowMap.set(x, processCell(z, y, x));
        }
        newLayerMap.set(y, newRowMap);
      }
      newSpace.set(z, newLayerMap);
    }
    return newSpace;
  }
  for (let i = 1; i <= numSteps; i++) {
    space = processStep(i);
    // printSpace(space, i, initSize);
  }

  let activeCubeCount = 0;
  for (const [_, layerMap] of space) {
    for (const [_, rowMap] of layerMap) {
      for (const [_, cell] of rowMap) {
        cell && activeCubeCount++;
      }
    }
  }
  return activeCubeCount;
}

function runDay17Part2Logic(input: string, numSteps: number): number {
  // Parse input
  const inputLines = input.split('\n');
  const initSize = inputLines.length;
  let hyperspace: Map4D = new Map(), space: Map3D = new Map();
  const zeroLayerMap = new Map();
  inputLines.forEach((line, y) => {
    const rowMap = new Map();
    line.split('').forEach((char, x) => {
      rowMap.set(x, char === '#');
    });
    zeroLayerMap.set(y, rowMap);
  });
  space.set(0, zeroLayerMap);
  hyperspace.set(0, space);

  const processCell = (cellW: number, cellZ: number, cellY: number, cellX: number): boolean => {
    let activeNeighbourCount = 0;
    for (let w = cellW - 1; w <= cellW + 1; w++) {
      const space = hyperspace.get(w);
      for (let z = cellZ - 1; z <= cellZ + 1; z++) {
        const layerMap = space?.get(z);
        for (let y = cellY - 1; y <= cellY + 1; y++) {
          const rowMap = layerMap?.get(y);
          for (let x = cellX - 1; x <= cellX + 1; x++) {
            if (!!rowMap?.get(x)) activeNeighbourCount++;
          }
        }
      }
    }
    const activity = hyperspace.get(cellW)?.get(cellZ)?.get(cellY)?.get(cellX) ?? false;
    if (activity) {
      activeNeighbourCount--; // don't count itself
      return (activeNeighbourCount === 2 || activeNeighbourCount === 3);
    }
    else
      return activeNeighbourCount === 3;
  };
  const processStep = (stepNum: number): Map4D => {
    const newHyperspace = new Map();
    for (let w = -stepNum; w <= stepNum; w++) {
      const newSpace = new Map();
      for (let z = -stepNum; z <= stepNum; z++) {
        const newLayerMap = new Map();
        for (let y = -stepNum; y < initSize + stepNum; y++) {
          const newRowMap = new Map();
          for (let x = -stepNum; x < initSize + stepNum; x++) {
            newRowMap.set(x, processCell(w, z, y, x));
          }
          newLayerMap.set(y, newRowMap);
        }
        newSpace.set(z, newLayerMap);
      }
      newHyperspace.set(w, newSpace);
    }
    return newHyperspace;
  }
  for (let i = 1; i <= numSteps; i++) {
    hyperspace = processStep(i);
    // printSpace(space, i, initSize);
  }

  let activeCubeCount = 0;
  for (const [_, space] of hyperspace) {
    for (const [_, layerMap] of space) {
      for (const [_, rowMap] of layerMap) {
        for (const [_, cell] of rowMap) {
          cell && activeCubeCount++;
        }
      }
    }
  }
  return activeCubeCount;
}

function runDay17Logic(input: string) {
  console.log(`Part 1: ${runDay17Part1Logic(input, 6)}`);
  console.log(`Part 2: ${runDay17Part2Logic(input, 6)}`);
}

const day17TestData: string =
`.#.
..#
###`;

function day17Test() {
  console.log("\nTEST\n");

  runDay17Logic(day17TestData);
}

function day17() {
  const input: string = require('fs').readFileSync('./input17.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay17Logic(input);
}

day17Test();
day17();
