const day13TestData: string =
  `939
7,13,x,x,59,x,31,19`;

const day13Part2TestBusLists: Array<string> = [
  '17,x,13,19',
  '67,7,59,61',
  '67,x,7,59,61',
  '67,7,x,59,61',
  '1789,37,47,1889'
];

interface busDepartureCriteria {
  id: number;
  offset: number;
};

function parseInput(input: string): { earliestTime: number, busIDs: Array<number>} {
  const lines = input.split('\n');
  const potentialBusIDs = lines[1].split(',');
  const busIDs: Array<number> = [];
  potentialBusIDs.forEach(id => {
    const idNum = parseInt(id);
    !isNaN(idNum) && busIDs.push(idNum);
  });
  return { earliestTime: parseInt(lines[0]), busIDs };
}

function findEarliestBus(earliestTime: number, busIDs: Array<number>): { busToBoard: number, waitTime: number } {
  const result = {busToBoard: 0, waitTime: Number.MAX_VALUE};
  busIDs.forEach(id => {
    const waitTime = id - (earliestTime % id);
    if (waitTime < result.waitTime) {
      result.busToBoard = id;
      result.waitTime = waitTime;
    }
  });
  // console.log(result);
  return result;
}

function parseBusDepartureCriteria(input: string): Array<busDepartureCriteria> {
  const result: Array<busDepartureCriteria> = [];
  input.split(',').forEach((id, index) => {
    const idNum = parseInt(id);
    !isNaN(idNum) && result.push({
      id: idNum,
      offset: index
    });
  })
  return result;
}

function findLCM(a: number, b: number): number {
  const findGCD = (x: number, y: number): number => { return !y ? x : findGCD(y, x % y); };
  return (a * b) / findGCD(a, b);
}

function findEarliestQualifyingTimestamp(criteria: Array<busDepartureCriteria>): number {
  let result = criteria[0].id, step = criteria[0].id;

  criteria.forEach((cri, index) => {
    if (index === 0) return;
    while ((result + cri.offset) % cri.id !== 0) result += step;
    // console.log(`result of adding bus ${cri.id}: ${result}`);
    step = findLCM(step, cri.id);
    // console.log(`New step: ${step}`);
  });

  return result;

}

function runDay13Logic(input: string) {
  const { earliestTime, busIDs } = parseInput(input);
  const { busToBoard, waitTime } = findEarliestBus(earliestTime, busIDs);
  console.log(`Part 1: ${busToBoard * waitTime}`);

  const departureCriteria: Array<busDepartureCriteria> = parseBusDepartureCriteria(input.split('\n')[1]);
  console.log(`Part 2: ${findEarliestQualifyingTimestamp(departureCriteria)}`);
}

function day13Test() {
  console.log("\nTEST\n");

  runDay13Logic(day13TestData);
  // Additional tests
  day13Part2TestBusLists.forEach((input, index) => {
    const departureCriteria: Array<busDepartureCriteria> = parseBusDepartureCriteria(input);
    console.log(`Part 2-${index + 1}: ${findEarliestQualifyingTimestamp(departureCriteria)}`);
  });
}

function day13() {
  const input: string = require('fs').readFileSync('./input13.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay13Logic(input);
}

day13Test();
day13();
