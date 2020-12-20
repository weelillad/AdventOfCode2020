interface numRange {
  min: number;
  max: number;
}

function getRow(rowCode: string): number {
  const numRange = {min: 0, max: 127};
  rowCode.split('').forEach(code => {
    const width = numRange.max - numRange.min + 1;
    switch (code) {
      case 'F':
        numRange.max -= width / 2;
        break;
      case 'B':
        numRange.min += width / 2;
        break;
      default:
        console.log(`ERROR: Unrecognized row code ${code}`);
        break;
    }
  })
  if (numRange.min != numRange.max) console.log(`ERROR: More than 1 row! ${numRange.min}-${numRange.max}`);
  return numRange.min;
}

function getColumn(columnCode: string): number {
  const numRange = {min: 0, max: 7};
  columnCode.split('').forEach(code => {
    const width = numRange.max - numRange.min + 1;
    switch (code) {
      case 'L':
        numRange.max -= width / 2;
        break;
      case 'R':
        numRange.min += width / 2;
        break;
      default:
        console.log(`ERROR: Unrecognized row code ${code}`);
        break;
    }
  })
  if (numRange.min != numRange.max) console.log(`ERROR: More than 1 column! ${numRange.min}-${numRange.max}`);
  return numRange.min;
}

function boardingToSeatNum(pass: string): number {
  const rowNum = getRow(pass.substring(0,7));
  const columnNum = getColumn(pass.substring(7));
  const seatNum = rowNum * 8 + columnNum;
  console.log(`Pass ${pass}: Row ${rowNum}, Column ${columnNum}, seatID ${seatNum}`);
  return seatNum
}

function getHighestSeatNum(boardingPasses: Array<string>): number {
  let highestSeatNum = 0;
  boardingPasses.forEach(pass => highestSeatNum = Math.max(highestSeatNum, boardingToSeatNum(pass)));
  return highestSeatNum;
}

function findMySeat(boardingPasses: Array<string>): number {
  const seatisOccupied: Array<boolean> = new Array(832 + 1);
  boardingPasses.forEach(pass => {
    const seatNum = boardingToSeatNum(pass);
    seatisOccupied[seatNum] = true;
  });
  let i = 2;
  while (i < 832 && !(seatisOccupied[i - 2] && !seatisOccupied[i - 1] && seatisOccupied[i])) i++;
  return i - 1;
}

const day05TestData1 = [
  "FBFBBFFRLR",
  "BFFFBBFRRR",
  "FFFBBBFRRR",
  "BBFFBBFRLL"
]

function day05Test() {
  console.log("\nTEST\n");
  console.log("Part 1:");
  day05TestData1.forEach(pass => boardingToSeatNum(pass));
  // console.log("Part 2: " + boardingToSeatNum(day05TestData2, true));
}

function day05() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input05.txt', 'utf8');

  console.log("\nACTUAL\n");
  // console.log("Part 1:" + getHighestSeatNum(input.split('\n')));
  console.log("Part 2: " + findMySeat(input.split('\n')));
}

// day05Test();
day05();
