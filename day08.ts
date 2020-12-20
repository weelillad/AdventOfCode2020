interface Instruction {
  op: 'acc'|'jmp'|'nop';
  arg: number;
  executed: boolean;
}

function parseProgram(input: string): Array<Instruction> {
  const program: Array<Instruction> = [];
  input.split('\n').forEach(line => {
    const [op, argStr] = line.split(' ');
    if (op !== 'acc' && op !== 'jmp' && op !== 'nop') {
      console.log(`ERROR: Invalid operator ${op}`);
      return;
    }
    program.push({op, arg: parseInt(argStr), executed: false});
  });
  return program;
}

function resetProgram(program: Array<Instruction>) {
  program.forEach(line => line.executed = false);
}

function executeProgram(program: Array<Instruction>): { accumulator: number, pointer: number } {
  let accumulator = 0, pointer = 0;

  while (pointer < program.length && !program[pointer].executed) {
    program[pointer].executed = true;
    switch (program[pointer].op) {
      case 'acc':
        accumulator += program[pointer].arg;
        pointer++
        break;
      case 'jmp':
        pointer += program[pointer].arg;
        break;
      case 'nop':
        pointer++;
        break;
    }
  }

  return { accumulator, pointer };
}

function findProgramFix(program: Array<Instruction>) {
  let changedLineIndex = -1;
  let result: { accumulator: number, pointer: number } = {
    accumulator: 0,
    pointer: 0
  };
  do {
    changedLineIndex++;
    resetProgram(program);
    if (program[changedLineIndex].op === 'acc') continue;

    if (program[changedLineIndex].op === 'nop')
      program[changedLineIndex].op = 'jmp';
    else
      program[changedLineIndex].op = 'nop';

    result = executeProgram(program);

    // Restore program to original shape
    if (program[changedLineIndex].op === 'nop')
      program[changedLineIndex].op = 'jmp';
    else
      program[changedLineIndex].op = 'nop';
  } while (result.pointer < program.length);

  console.log(`Modified line index: ${changedLineIndex}; New result: ${result.accumulator}`);
}

const day08TestData: string =
`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

function day08Test() {
  console.log("\nTEST\n");

  const program: Array<Instruction> = parseProgram(day08TestData);

  console.log(`Part 1: ${executeProgram(program).accumulator}`);
  console.log(`Part 2:`);
  findProgramFix(program);
}

function day08() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input08.txt', 'utf8');

  console.log("\nACTUAL\n");

  const program: Array<Instruction> = parseProgram(input);

  console.log(`Part 1: ${executeProgram(program).accumulator}`);
  console.log(`Part 2:`);
  findProgramFix(program);
}

day08Test();
day08();