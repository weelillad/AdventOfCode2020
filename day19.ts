function parseDay19Rules(input: Array<string>): Map<number, Array<string>> {
  const rulesArray: Map<number, Array<string>> = new Map();
  input.forEach(rule => {
    const result = /^(\d+): (?:([\d\s|]+)|("\w"))$/.exec(rule);
    rulesArray.set(parseInt(result![1]), result![2]?.split(' | ') || [result![3].replace(/"/g, '')]);
  });
  // console.log(rulesArray);
  return rulesArray;
}

function countRuleMatches(rules: Map<number, Array<string>>, messages: Array<string>): number {
  const doMatch = (rule: string, msg: string): boolean => {
    // console.log(`Matching rule ${rule} with message ${msg}`);
    if (rule.length === 0) {
      const success = msg.length === 0;
      return success;
    }
    const ruleFrags = rule.split(' ');
    const currentRule = parseInt(ruleFrags[0]);
    const ruleExpansions = rules.get(currentRule)!;
    for (const expansion of ruleExpansions) {
      if (isNaN(parseInt(expansion))) {
        if (msg.startsWith(expansion)) {
          if (doMatch(ruleFrags.slice(1).join(' '), msg.substring(expansion.length))) {
            // console.log(true);
            return true;
          }
        }
      } else {
        if (doMatch(expansion + ' ' + ruleFrags.slice(1).join(' '), msg)) {
          // console.log(true);
          return true;
        }
      }
    }
    // console.log(false);
    return false;
  };
  return messages.reduce((matchCount, msg) => {
    const result = doMatch('0', msg);
    // console.log(result);
    return result
      ? matchCount + 1
      : matchCount;
  }, 0);
}

function runDay19Logic(input: string) {
  const [rules, messages] = input.split('\n\n');
  const rulesMap = parseDay19Rules(rules.split('\n'));
  console.log(`Part 1: ${countRuleMatches(rulesMap, messages.split('\n'))}`);

  rulesMap.set(8, ['42', '42 8']);
  rulesMap.set(11, ['42 31', '42 11 31']);
  console.log(`Part 2: ${countRuleMatches(rulesMap, messages.split('\n'))}`);
}

const day19TestData: string =
  `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

const day19TestData2: string =
  `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;

function day19Test() {
  console.log("\nTEST\n");

  // runDay19Logic(day19TestData);
  runDay19Logic(day19TestData2);
}

function day19() {
  const input: string = require('fs').readFileSync('./input19.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay19Logic(input);
}

// day19Test();
day19();
