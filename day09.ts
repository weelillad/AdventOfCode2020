function checkXmasRule(preambleSequence: Array<number>, testNum: number): boolean {
  // console.log(preambleSequence);
  for (let loc = 0; loc < preambleSequence.length - 1; loc++) {
    if (preambleSequence.slice(loc + 1).includes(testNum - preambleSequence[loc])) return true;
  }
  return false;
}

function findFirstViolator(sequence: Array<number>, preambleLen: number): number {
  let pointer = preambleLen;
  for (; pointer < sequence.length; pointer++) {
    // console.log(`Checking index ${pointer}, value ${sequence[pointer]}`);
    if (!checkXmasRule(sequence.slice(pointer - preambleLen, pointer), sequence[pointer])) break;
  }
  return sequence[pointer];
}

function findContiguousSumArray(sequence: Array<number>, targetNum: number): Array<number> {
  for (let i = 0; i < sequence.length - 1; i++) {
    let remainder = targetNum - sequence[i];
    for (let j = i + 1; i < sequence.length; j++) {
      remainder -= sequence[j];
      if (remainder === 0)
        return sequence.slice(i, j + 1);
      else if (remainder < 0)
        break;
    }
  }
  return [];
}

function findEncryptionWeakness(sequence: Array<number>): number {
  const sortedSequence = sequence.sort((a, b) => a - b);
  return sortedSequence[0] + sortedSequence[sortedSequence.length - 1];
}

const day09TestData: string =
`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

function day09Test() {
  console.log("\nTEST\n");

  const sequence: Array<number> = day09TestData.split('\n').map(str => parseInt(str));

  console.log(`Part 1: ${findFirstViolator(sequence, 5)}`);
  console.log(`Part 2: ${findEncryptionWeakness(findContiguousSumArray(sequence, 127))}`);
}

function day09() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input09.txt', 'utf8');

  console.log("\nACTUAL\n");

  const sequence: Array<number> = input.split('\n').map(str => parseInt(str));

  console.log(`Part 1: ${findFirstViolator(sequence, 25)}`);
  console.log(`Part 2: ${findEncryptionWeakness(findContiguousSumArray(sequence, 542529149))}`);
}

day09Test();
day09();