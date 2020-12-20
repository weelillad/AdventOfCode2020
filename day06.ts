function countQuestionsWithAnyYes(input: string): number {
  const charMap: Map<string, boolean> = new Map();
  input.split('').forEach(char => {
    charMap.set(char, true);
  });
  return charMap.size;
}

function countQuestionsWithAllYes(inputArray: Array<string>): number {
  const charMap: Map<string, number> = new Map();
  inputArray.forEach(input => {
    input.split('').forEach(char => {
      charMap.set(char, (charMap.get(char) ?? 0) + 1);
    });
  });

  const iterator = charMap.values();
  let count = 0;
  let value = iterator.next();
  while (!value.done) {
    if (value.value === inputArray.length) count++;
    value = iterator.next();
  }
  return count;
}

function day06Part1(inputStr: string): number {
  return inputStr.split('\n\n')
    .map(str => str.replace(/[^a-z]/g, ''))
    .reduce((currCount, str) => currCount + countQuestionsWithAnyYes(str), 0);
}

function day06Part2(inputStr: string): number {
  return inputStr.split('\n\n')
    .map(str => str.split('\n'))
    .reduce((currCount, strArray) => currCount + countQuestionsWithAllYes(strArray), 0);
}

const day06TestData =
`abc

a
b
c

ab
ac

a
a
a
a

b`;

function day06Test() {
  console.log("\nTEST\n");
  console.log(`Part 1: ${day06Part1(day06TestData)}`);
  console.log(`Part 2: ${day06Part2(day06TestData)}`);
}

function day06() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input06.txt', 'utf8');

  console.log("\nACTUAL\n");
  console.log(`Part 1: ${day06Part1(input)}`);
  console.log(`Part 2: ${day06Part2(input)}`);
}

day06Test();
day06();