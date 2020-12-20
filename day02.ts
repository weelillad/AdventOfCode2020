#!/usr/bin/env ts-node-script

function checkPass(val: string): number {
  // Check that line is not empty
  if (val.length === 0) return 0;

  // Break the line into the 3 components
  const [lengthCondition, targetLetter, pwString] = val.split(' ');
  // Check the password against the condition
  const [leftNum, rightNum] = lengthCondition.split('-');

  // PART 1
  // const regex = new RegExp(`[^${targetLetter[0]}]`, 'gi');
  // const charCount = pwString.replace(regex, '').length
  // return charCount <= parseInt(rightNum) && charCount >= parseInt(leftNum)
  //   ? 1
  //   : 0;

  // PART 2
  return (pwString[parseInt(leftNum) - 1] === targetLetter[0]) !== (pwString[parseInt(rightNum) - 1] === targetLetter[0])
    ? 1
    : 0;
}

function day02() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./Day02/input02.txt', 'utf8');

  const inputArray: Array<string> = input.split('\n');

  let validCount = 0;
  inputArray.forEach(val => validCount += checkPass(val));

  console.log(validCount);
}

function day02Test() {
  // Test cases
  console.log(`Test Case 1: ${checkPass('1-3 a: abcde')}`);
  console.log(`Test Case 2: ${checkPass('1-3 b: cdefg')}`);
  console.log(`Test Case 3: ${checkPass('2-9 c: ccccccccc')}`);
}

// day02Test();
day02();
