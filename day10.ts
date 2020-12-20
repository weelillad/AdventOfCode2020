function collateJoltDifferences(sortedAdapterSequence: Array<number>): { oneJolt: number, threeJolt: number } {
  const result = { oneJolt: 0, threeJolt: 0};
  let prevJolt = 0;
  sortedAdapterSequence.forEach(jolt => {
    switch (jolt - prevJolt) {
      case 1:
        result.oneJolt++;
        break;
      case 3:
        result.threeJolt++;
        break;
      default:
        break;
    }
    prevJolt = jolt;
  });
  // add device's difference
  result.threeJolt++;
  return result;
}

function findAdapterArrangements(sortedAdapterSequence: Array<number>): number {
  const lowestAdapter = sortedAdapterSequence[0];
  const combisFromHere: Map<number, number> = new Map();
  sortedAdapterSequence.reverse().forEach((jolt, index) => {
    // Base case: connect directly to device
    if (index === 0) { combisFromHere.set(jolt, 1);}
    else {
      let combis = 0;
      for (let i = 1; i <= 3; i++) {
        combis += combisFromHere.get(jolt + i) ?? 0;
      }
      combisFromHere.set(jolt, combis);
    }
  });
  return (combisFromHere.get(1) ?? 0) + (combisFromHere.get(2) ?? 0) + (combisFromHere.get(3) ?? 0);
}

const day10TestData1 =
`16
10
15
5
1
11
7
19
6
12
4`;

const day10TestData2 =
`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

function day10Test() {
  console.log("\nTEST\n");

  const sortedSequence1: Array<number> = day10TestData1.split('\n').map(str => parseInt(str)).sort((a, b) => a - b);
  const sortedSequence2: Array<number> = day10TestData2.split('\n').map(str => parseInt(str)).sort((a, b) => a - b);

  console.log("PART 1");
  const result1 = collateJoltDifferences(sortedSequence1);
  console.log(`Test 1 - 1-jolt: ${result1.oneJolt}; 3-jolt: ${result1.threeJolt}; Product: ${result1.oneJolt * result1.threeJolt}`);
  const result2 = collateJoltDifferences(sortedSequence2);
  console.log(`Test 2 - 1-jolt: ${result2.oneJolt}; 3-jolt: ${result2.threeJolt}; Product: ${result2.oneJolt * result2.threeJolt}`);

  console.log("PART 2");
  console.log(`Test 1: ${findAdapterArrangements(sortedSequence1)}`);
  console.log(`Test 2: ${findAdapterArrangements(sortedSequence2)}`);
}

function day10() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input10.txt', 'utf8');

  console.log("\nACTUAL\n");

  const sortedSequence: Array<number> = input.split('\n').map(str => parseInt(str)).sort((a, b) => a - b);

  const result = collateJoltDifferences(sortedSequence);
  console.log(`Part 1 - 1-jolt: ${result.oneJolt}; 3-jolt: ${result.threeJolt}; Product: ${result.oneJolt * result.threeJolt}`);
  console.log(`Part 2: ${findAdapterArrangements(sortedSequence)}`);
}

day10Test();
day10();