interface SeaObject {
  posEW: number; // East is positive
  posNS: number; // North is positive
}

interface NavInstruction {
  action: string;
  quantity: number;
}

function parseInstructions(inputString: string): Array<NavInstruction> {
  const navArray: Array<NavInstruction> = [];
  inputString.split('\n').forEach(instrStr => {
    navArray.push({ action: instrStr[0], quantity: parseInt(instrStr.substring(1)) });
  });
  return navArray;
}

function executeInstructions(ship: SeaObject, waypoint: SeaObject, instructions: Array<NavInstruction>, isPart2: boolean) {
  const moveObjectAbsolute = (object: SeaObject, dir: 'N' | 'S' | 'E' | 'W', amount: number) => {
    switch (dir) {
      case 'N':
        object.posNS += amount;
        break;
      case 'S':
        object.posNS -= amount;
        break;
      case 'W':
        object.posEW -= amount;
        break;
      case 'E':
        object.posEW += amount;
        break;
    }
  };

  const rotateWaypoint = (quant: number) => {
    switch (quant) {
      case 90:
        waypoint = { posEW: waypoint.posNS, posNS: -waypoint.posEW };
        break;
      case 180:
        waypoint = { posEW: -waypoint.posEW, posNS: -waypoint.posNS };
        break;
      case 270:
        waypoint = { posEW: -waypoint.posNS, posNS: waypoint.posEW };
        break;
    }
  };

  instructions.forEach(instr => {
    switch (instr.action) {
      case 'N':
      case 'S':
      case 'W':
      case 'E':
        isPart2
          ? moveObjectAbsolute(waypoint, instr.action, instr.quantity)
          : moveObjectAbsolute(ship, instr.action, instr.quantity);
        break;
      case 'F':
        ship.posNS += (waypoint.posNS * instr.quantity);
        ship.posEW += (waypoint.posEW * instr.quantity);
        break;
      case 'L':
        // Resolve into clockwise rotation
        rotateWaypoint(360 - instr.quantity);
        break;
      case 'R':
        rotateWaypoint(instr.quantity);
        break;
    }
    // console.log(`${instr} - ${shipState}`);
  });
}

const day12TestData: string =
  `F10
N3
F7
R90
F11`;

function runDay12Logic(input: string) {
  const instructions = parseInstructions(input);

  const ship: SeaObject = { posEW: 0, posNS: 0 };
  const waypoint: SeaObject = { posEW: 1, posNS: 0 };
  executeInstructions(ship, waypoint, instructions, false);
  console.log(`PART 1: ${Math.abs(ship.posNS) + Math.abs(ship.posEW)}`);

  const ship2: SeaObject = { posEW: 0, posNS: 0 };
  const waypoint2: SeaObject = { posEW: 10, posNS: 1 };
  executeInstructions(ship2, waypoint2, instructions, true);
  console.log(`PART 2: ${Math.abs(ship2.posNS) + Math.abs(ship2.posEW)}`);
}

function day12Test() {
  console.log("\nTEST\n");

  runDay12Logic(day12TestData);
}

function day12() {
  const input: string = require('fs').readFileSync('./input12.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay12Logic(input);
}

day12Test();
day12();
