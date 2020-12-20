function findClosingBracket(tokens: Array<string>): number {
  // Find closing bracket
  let openBracketCount = 1, tempPointer = 0, currToken = tokens[0].substring(1);
  while (openBracketCount > 0) {
    if (currToken.startsWith('(')) {
      openBracketCount++;
      currToken = currToken.substring(1);
    } else if (currToken.endsWith(')')) {
      openBracketCount--;
      currToken = currToken.substring(0, currToken.length - 1);
    } else {
      tempPointer++;
      currToken = tokens[tempPointer];
    }
  }
  return tempPointer;
};

function solvePart1Expression(tokens: Array<string>): number {
  // console.log('Solving ', tokens);
  // Pass through expression and solve sub-expressions
  for (let pointer = 0; pointer < tokens.length; pointer++) {
    if (tokens[pointer].startsWith('(')) {
      const subExprLength = findClosingBracket(tokens.slice(pointer))
      const lastSubExprToken = pointer + subExprLength;
      const subExprTokens: Array<string> = [
        tokens[pointer].substring(1), // Starting token minus opening bracket
        ...tokens.slice(pointer + 1, lastSubExprToken),
        tokens[lastSubExprToken].substring(0, tokens[lastSubExprToken].length - 1) // Ending token minus closing bracket
      ];
      // console.log('Substring: ', subExprTokens);
      tokens.splice(pointer, subExprLength + 1, String(solvePart1Expression(subExprTokens)));
      // console.log("New tokens: ", tokens);
    }
  }
  // Pass through main expression and solve everything
  let answer = parseInt(tokens[0]);
  for (let pointer = 1; pointer < tokens.length; pointer += 2) {
    if (tokens[pointer] === '+') {
      answer += parseInt(tokens[pointer + 1]);
    } else if (tokens[pointer] === '*') {
      answer *= parseInt(tokens[pointer + 1]);
    }
  }
  return answer;
}

function solvePart2Expression(tokens: Array<string>): number {
  // console.log('Solving ', tokens);
  // Pass through expression and solve sub-expressions
  for (let pointer = 0; pointer < tokens.length; pointer++) {
    if (tokens[pointer].startsWith('(')) {
      const subExprLength = findClosingBracket(tokens.slice(pointer))
      const lastSubExprToken = pointer + subExprLength;
      const subExprTokens: Array<string> = [
        tokens[pointer].substring(1), // Starting token minus opening bracket
        ...tokens.slice(pointer + 1, lastSubExprToken),
        tokens[lastSubExprToken].substring(0, tokens[lastSubExprToken].length - 1) // Ending token minus closing bracket
      ];
      // console.log('Substring: ', subExprTokens);
      tokens.splice(pointer, subExprLength + 1, String(solvePart2Expression(subExprTokens)));
      // console.log("New tokens: ", tokens);
    }
  }
  // Pass through expression and solve additions
  for (let pointer = 0; pointer < tokens.length; pointer++) {
    if (tokens[pointer] === '+') {
      tokens.splice(pointer - 1, 3, String(parseInt(tokens[pointer - 1]) + parseInt(tokens[pointer + 1])));
      pointer--;
      // console.log("New tokens: ", tokens);
    }
  }
  // Pass through expression and solve multiplications (should be all that remains)
  let answer = 1;
  for (let pointer = 0; pointer < tokens.length; pointer += 2) {
    answer *= parseInt(tokens[pointer]);
  }
  return answer;
}

function runDay18Logic(input: string) {
  const expressions = input.split('\n');
  console.log(`Part 1: ${expressions.reduce((sum, exprString) => sum + solvePart1Expression(exprString.split(' ')), 0)}`);
  console.log(`Part 2: ${expressions.reduce((sum, exprString) => sum + solvePart2Expression(exprString.split(' ')), 0)}`);
}

const day18TestData: string =
  `1 + 2 * 3 + 4 * 5 + 6
1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

function day18Test() {
  console.log("\nTEST\n");

  const testExpressions = day18TestData.split('\n');
  console.log('Part 1');
  // console.log(solvePart1Expression(testExpressions[3].split(' ')));
  testExpressions.forEach(exprString => console.log(solvePart1Expression(exprString.split(' '))));
  console.log('Part 2');
  // console.log(solvePart2Expression(testExpressions[1].split(' ')));
  testExpressions.forEach(exprString => console.log(solvePart2Expression(exprString.split(' '))));
}

function day18() {
  const input: string = require('fs').readFileSync('./input18.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay18Logic(input);
}

day18Test();
day18();
