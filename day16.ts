interface Range {
  min: number;
  max: number;
};

interface TicketRule {
  fieldName: string;
  ranges: Array<Range>;
  eligiblePositions: Array<number>;
};

function parseDay16Input(input: string): {rules: Array<TicketRule>, ownTicket: Array<number>, otherTickets: Array<Array<number>>} {
  const inputSections: Array<string> = input.split('\n\n');

  const rules: Array<TicketRule> = [];
  inputSections[0].split('\n').forEach(str => {
    const parts = str.split(': ');
    const ranges: Array<Range> = [];
    parts[1].split(' or ').forEach(rangeStr => {
      const nums = rangeStr.split('-');
      ranges.push({ min: parseInt(nums[0]), max: parseInt(nums[1]) });
    });
    // console.log(ranges);
    rules.push({ fieldName: parts[0], ranges, eligiblePositions: [] });
  });

  const parseTicket = (ticketString: string): Array<number> => ticketString.split(',').map(str => parseInt(str));

  return {
    rules,
    ownTicket: parseTicket(inputSections[1].split('\n')[1]),
    otherTickets: inputSections[2].split('\n').slice(1).map(tixStr => parseTicket(tixStr))
  };
}

function squashRanges(rules: Array<TicketRule>): Array<Range> {
  const squashedRanges: Array<Range> = [];
  rules.forEach(rule => rule.ranges.forEach(range => {
    // console.log(`Considering range (${range.min},${range.max})`);
    for (const sRange of squashedRanges) {
      if (range.min >= sRange.min && range.max <= sRange.max) {
        // console.log(`Subsumed into (${sRange.min},${sRange.max})`);
        return;
      }
      if (range.min >= sRange.min && range.min <= sRange.max + 1  && range.max > sRange.max) {
        // console.log(`Merged into (${sRange.min},${sRange.max})`);
        sRange.max = range.max;
        return;
      }
      if (range.min < sRange.min && range.max >= sRange.min - 1 && range.max <= sRange.max) {
        // console.log(`Merged into (${sRange.min},${sRange.max})`);
        sRange.min = range.min;
        return;
      }
      if (range.min < sRange.min && range.max > sRange.max) {
        // console.log(`Swallows (${range.min},${range.max})`);
        sRange.min = range.min;
        sRange.max = range.max;
        return;
      }
    }
    // Base case: range did not affect other ranges
    // console.log('Added as-is');
    squashedRanges.push({...range});
  }));
  // console.log(squashedRanges);
  squashedRanges.forEach(range => {

  })
  return squashedRanges;
}

function isNumWithinFieldRanges(ranges: Array<Range>, num: number): boolean {
  for (const range of ranges) {
    if (num >= range.min && num <= range.max) {
      return true;
    }
  }
  return false;
}

function scanTickets(ranges: Array<Range>, tickets: Array<Array<number>>): {errorRate: number, validTickets: Array<Array<number>>} {
  const validTickets: Array<Array<number>> = [];
  let errorRate = 0;
  tickets.forEach(tix => {
    let isValidTix = true;
    tix.forEach(num => {
      if (!isNumWithinFieldRanges(ranges, num)) {
        isValidTix = false;
        errorRate += num;
      }
    });
    if (isValidTix) validTickets.push(tix);
  });
  // console.log(validTickets);
  return { errorRate, validTickets };
}

function findEligibleFieldPositions(field: TicketRule, tickets: Array<Array<number>>) {
  const eligiblePositions: Array<number> = [];
  for (let positionToCheck = 0; positionToCheck < tickets[0].length; positionToCheck++) {
    const allMatch = tickets.reduce<boolean>((match, tix) => {
      return match && isNumWithinFieldRanges(field.ranges, tix[positionToCheck]);
    }, true);
    // console.log(`${positionToCheck}: ${allMatch}`);
    if (allMatch) eligiblePositions.push(positionToCheck);
  }
  field.eligiblePositions = eligiblePositions;
}

function runDay16Logic(input: string) {
  const { rules, ownTicket, otherTickets } = parseDay16Input(input);

  const squashedRanges = squashRanges(rules);
  const { errorRate, validTickets } = scanTickets(squashedRanges, otherTickets);
  console.log(`Part 1: ${errorRate}`);

  rules.forEach(rule => findEligibleFieldPositions(rule, validTickets));
  rules.sort((a, b) => a.eligiblePositions.length - b.eligiblePositions.length);
  rules.forEach((rule, index) => {
    if (rule.eligiblePositions.length > 1) console.log("ERROR");
    for (let pointer = index + 1; pointer < rules.length; pointer++) {
      rules[pointer].eligiblePositions.splice(rules[pointer].eligiblePositions.indexOf(rule.eligiblePositions[0]), 1);
    }
  });
  // console.log(parsedInput.rules);
  const part2Answer = rules.reduce((product, rule) => {
    return rule.fieldName.startsWith('departure')
      ? product * ownTicket[rule.eligiblePositions[0]]
      : product;
  }, 1)
  console.log(`Part 2: ${part2Answer}`);
}

const day16TestData: string =
  `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

const day16TestData2: string =
  `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;

function day16Test() {
  console.log("\nTEST\n");

  runDay16Logic(day16TestData);

  // Part 2 test
  const parsedInput = parseDay16Input(day16TestData2);
  parsedInput.rules.forEach(rule => {
    console.log(`${rule.fieldName} is in position ${findEligibleFieldPositions(rule, parsedInput.otherTickets)}`);
  });
}

function day16() {
  const input: string = require('fs').readFileSync('./input16.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay16Logic(input);
}

day16Test();
day16();