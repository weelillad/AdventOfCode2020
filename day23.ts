function runDay23Logic(input: string) {
  const runMoves = (cupsArray: Array<number>, numMoves: number) => {
    const findDestinationCupIndex = (currCupValue: number) => {
      const sortedArray = [...cupsArray].sort((a, b) => b - a);
      const currIndex = sortedArray.indexOf(currCupValue);
      const destCupValue = sortedArray[(currIndex === sortedArray.length - 1) ? 0 : currIndex + 1];
      return cupsArray.indexOf(destCupValue);
    }

    let movesElapsed = 0;
    while (movesElapsed < numMoves) {
      const pickup = cupsArray.splice(1, 3);
      const destinationCupIndex = findDestinationCupIndex(cupsArray[0]);
      cupsArray.splice(destinationCupIndex + 1, 0, ...pickup);
      cupsArray.push(cupsArray.shift()!);
      movesElapsed++;
      // if (turnsElapsed <= 10) console.log(cupsArray);
    }
  }

  const part1CupsArray = input.split('').map(x => parseInt(x));
  runMoves(part1CupsArray, 100);

  while (part1CupsArray[0] !== 1) {
    part1CupsArray.push(part1CupsArray.shift()!);
  }
  console.log('Part 1:', part1CupsArray.slice(1).join(''));

  const part2CupsArray = input.split('').map(x => parseInt(x));
  for (let i = 11; i <= 1000000; i++) {
    part2CupsArray.push(i);
  }
  runMoves(part2CupsArray, 10000000);

  const oneIndex = part2CupsArray.indexOf(1);
  console.log('Part 2:', part2CupsArray[oneIndex + 1] * part2CupsArray[oneIndex + 2]);
}

const day23TestData =
  `389125467`;

function day23Test() {
  console.log("\nTEST\n");

  runDay23Logic(day23TestData);
}

function day23() {
  // const input: string = require('fs').readFileSync('./input23.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay23Logic('739862541');
}

day23Test();
// day23();
