interface MaskInstruction {
  position: bigint;
  value: boolean;
}

function runPart1Instructions(input: string): Map<bigint, bigint> {
  const memory: Map<bigint, bigint> = new Map();

  let maskInstructions: Array<MaskInstruction> = [];

  const parseMask = (mask: string): Array<MaskInstruction> => {
    const maskInstr: Array<MaskInstruction> = [];
    mask.substring(7).split('').forEach((char, index) => {
      if (char === 'X') return;
      maskInstr.push({
        position: BigInt(35 - index),
        value: char === '1'
      });
    });
    // console.log(maskInstr);
    return maskInstr;
  };

  const applyMask = (input: bigint): bigint => {
    maskInstructions.forEach(instr => {
      let temp = input >> instr.position;
      if (instr.value && temp % 2n === 0n) input += 2n ** instr.position;
      else if (!instr.value && temp % 2n === 1n) input -= 2n ** instr.position;
    });
    return input;
  };

  const applyAssignment = (assignment: string) => {
    const regExpResult = assignment.match(/^mem\[(\d+)\] = (\d+)$/);
    const address = BigInt(regExpResult![1]),
      originalValue = BigInt(regExpResult![2]),
      maskedValue = applyMask(originalValue);
    // console.log(`Address ${address}: ${originalValue} => ${maskedValue}`);
    memory.set(address, maskedValue);
  }

  input.split('\n').forEach(inputStr => {
    if (inputStr.startsWith('mask')) {
      maskInstructions = parseMask(inputStr);
    } else if (inputStr.startsWith('mem')) {
      applyAssignment(inputStr);
    }
  });

  return memory;
}

function runPart2Instructions(input: string): Map<bigint, bigint> {
  const memory: Map<bigint, bigint> = new Map();

  let maskInstructions: Array<MaskInstruction> = [];

  const parseMask = (mask: string): Array<MaskInstruction> => {
    const maskInstr: Array<MaskInstruction> = [];
    mask.substring(7).split('').forEach((char, index) => {
      if (char === '0') return;
      maskInstr.push({
        position: BigInt(35 - index),
        value: char === '1'
      });
    });
    maskInstr.sort((a,b) => {
      if (a.value === b.value) return 0;
      return a.value ? -1 : 1;
    })
    // console.log(maskInstr);
    return maskInstr;
  };

  const applyMask = (input: bigint): Array<bigint> => {
    let addressArray: Array<bigint> = [input];
    maskInstructions.forEach(instr => {
      if (instr.value && (input >> instr.position) % 2n === 0n)
          addressArray = addressArray.map(addr => addr + 2n ** instr.position);
      else if (!instr.value) {
        const tempArray: Array<bigint> = [];
        addressArray.forEach(addr => {
          tempArray.push(addr);
          const rawVal = 2n ** instr.position;
          (addr >> instr.position) % 2n === 0n
            ? tempArray.push(addr + rawVal)
            : tempArray.push(addr - rawVal);
        })
        addressArray = tempArray;
      }
    });
    return addressArray;
  };

  const applyAssignment = (assignment: string) => {
    const regExpResult = assignment.match(/^mem\[(\d+)\] = (\d+)$/);
    const addresses = applyMask(BigInt(regExpResult![1])),
      value = BigInt(regExpResult![2]);
    // console.log(`Addresses ${addresses}: ${value}`);
    addresses.forEach(address => memory.set(address, value));
  }

  input.split('\n').forEach(inputStr => {
    if (inputStr.startsWith('mask')) {
      maskInstructions = parseMask(inputStr);
    } else if (inputStr.startsWith('mem')) {
      applyAssignment(inputStr);
    }
  });

  return memory;
}

function runDay14Logic(input: string) {
  const output = runPart1Instructions(input);
  // console.log(output);
  let memorySum = 0n;
  for (const [_, val] of output) {
    memorySum += val;
  }
  console.log(`Part 1: ${memorySum}`);

  const output2 = runPart2Instructions(input);
  // console.log(output);
  memorySum = 0n;
  for (const [_, val] of output2) {
    memorySum += val;
  }
  console.log(`Part 2: ${memorySum}`);
}

const day14Part1TestData: string =
  `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

const day14Part2TestData: string =
  `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

function day14Test() {
  console.log("\nTEST\n");

  runDay14Logic(day14Part2TestData);
}

function day14() {
  const input: string = require('fs').readFileSync('./input14.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay14Logic(input);
}

day14Test();
day14();