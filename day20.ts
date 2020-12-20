function runDay20Logic(input: string) {
  // const [rules, messages] = input.split('\n\n');
  // const rulesMap = parseDay20Rules(rules.split('\n'));
  // console.log(`Part 1: ${countRuleMatches(rulesMap, messages.split('\n'))}`);

  // rulesMap.set(8, ['42', '42 8']);
  // rulesMap.set(11, ['42 31', '42 11 31']);
  // console.log(`Part 2: ${countRuleMatches(rulesMap, messages.split('\n'))}`);
}

const day20TestData: string =
  ``;

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
// day20();