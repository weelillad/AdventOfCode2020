interface BagRuleCanContain {
  quantity: number;
  colour: string;
}

interface BagRule {
  colour: string;
  canContain: Array<BagRuleCanContain>;
}

function parseBagRule(ruleString: string): BagRule {
  const [colour, contentString] = ruleString.split(' bags contain ');
  const contents = contentString.split(', ');
  const canContainArray: Array<BagRuleCanContain> = [];
  contents.forEach(content => {
    if (content === 'no other bags.' || content.length === 0) return;
    const result = /(\d+) ([\w ]+) bags?\.?/.exec(content);
    canContainArray.push({ quantity: parseInt(result![1]), colour: result![2] });
  });
  return { colour, canContain: canContainArray };
}

function getRuleArray(inputString: string): Array<BagRule> {
  const ruleArray: Array<BagRule> = [];
  const ruleStrings = inputString.split('\n');
  ruleStrings.forEach(ruleString => {
    ruleArray.push(parseBagRule(ruleString));
    // console.log(parseBagRule(ruleString));
  });
  return ruleArray;
}

function findEligibleContainers(bagRules: Array<BagRule>, bagColours: Set<string>): Set<string> {
  if (bagColours.size === 0) return new Set();

  // console.log(bagColours);

  const eligibleBags: Set<string> = new Set();
  bagRules.forEach(rule => {
    // console.log(`Checking ${rule.colour}`);
    if (
      rule.canContain.reduce((hasColour, canContain) => {
        return hasColour || bagColours.has(canContain.colour)
      }, false)
    ) {
      // console.log(`Match found: ${rule.colour}`);
      eligibleBags.add(rule.colour);
    }
  });
  return new Set([...eligibleBags, ...findEligibleContainers(bagRules, eligibleBags)]);
}

function findNumberOfBagsInside(bagRules: Array<BagRule>, bagColour: string): number {
  const ruleForColour = bagRules.find(rule => rule.colour === bagColour);
  return ruleForColour!.canContain.reduce((bagCount, containRule) => {
    return bagCount + containRule.quantity * (findNumberOfBagsInside(bagRules, containRule.colour) + 1);
  }, 0);
}

const day07TestData =
  `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

const day07TestData2 =
  `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

function day07Test() {
  console.log("\nTEST\n");

  const ruleArray: Array<BagRule> = getRuleArray(day07TestData);

  console.log(`Part 1: ${findEligibleContainers(ruleArray, new Set(['shiny gold'])).size}`);
  console.log(`Part 2 Test 1: ${findNumberOfBagsInside(ruleArray, 'shiny gold')}`);
  const ruleArray2: Array<BagRule> = getRuleArray(day07TestData2);
  console.log(`Part 2 Test 2: ${findNumberOfBagsInside(ruleArray2, 'shiny gold')}`);
}

function day07() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input07.txt', 'utf8');

  console.log("\nACTUAL\n");

  const ruleArray: Array<BagRule> = getRuleArray(input);

  console.log(`Part 1: ${findEligibleContainers(ruleArray, new Set(['shiny gold'])).size}`);
  console.log(`Part 2: ${findNumberOfBagsInside(ruleArray, 'shiny gold')}`);
}

day07Test();
day07();