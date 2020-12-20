function playDay15Game(input: string, target: number): number {
  const memory: Map<number, number> = new Map();
  const inputArray = input.split(',').map(str => parseInt(str));
  inputArray.forEach((num, index) => memory.set(num, index + 1));
  let turnCount = inputArray.length;

  let nextNum = 0;
  do {
    turnCount++;
    // if (turnCount < 10) console.log(`Turn ${turnCount}: ${nextNum}`);
    const lastSeen = memory.get(nextNum) ?? -1;
    if (lastSeen >= 0) {
      // if (turnCount < 10) console.log(`Seen ${nextNum} before at turn ${lastSeen}`);
      const offset = turnCount - lastSeen;
      memory.set(nextNum, turnCount);
      nextNum = offset;
    } else {
      memory.set(nextNum, turnCount);
      nextNum = 0;
    }
  } while (turnCount < target - 1);
  return nextNum;
}

function runDay15Logic(input: string) {
  const part1Target = 2020, part2Target = 30000000;
  console.log(`Part 1: ${playDay15Game(input, part1Target)}`);

  console.log(`Part 2: ${playDay15Game(input, part2Target)}`);
}

const day15TestData: string =
  `0,3,6`;

const day15AdditionalTestData: Array<string> =
  [`1,3,2`,
    `2,1,3`,
    `1,2,3`,
    `2,3,1`,
    `3,2,1`,
    `3,1,2`];

function day15Test() {
  console.log("\nTEST\n");

  runDay15Logic(day15TestData);

  day15AdditionalTestData.forEach(inputStr => {
    console.log(`Part 2: ${playDay15Game(inputStr, 30000000)}`);
  });
}

function day15() {
  const input: string = require('fs').readFileSync('./input15.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay15Logic(input);
}

// day15Test();
day15();