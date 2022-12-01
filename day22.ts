function parseDay22Input(input: string): {p1: Array<number>, p2: Array<number>} {
  const [p1Hand, p2Hand] = input.split('\n\n');
  return {
    p1: p1Hand.split('\n').slice(1).map(x => parseInt(x)),
    p2: p2Hand.split('\n').slice(1).map(x => parseInt(x))
  };
}

function runDay22Logic(input: string) {
  const { p1: initP1, p2: initP2 } = parseDay22Input(input);

  let p1 = [...initP1], p2 = [...initP2];
  while (p1.length > 0 && p2.length > 0) {
    const p1Card = p1.shift()!, p2Card = p2.shift()!;
    if (p1Card > p2Card) p1.push(p1Card, p2Card);
    else p2.push(p2Card, p1Card);
  }

  const countScore = (winningHand: Array<number>): number => {
    const totalCardCount = winningHand.length;
    return winningHand.reduce((sum, card, index) => sum += (card * (totalCardCount - index)), 0);
  }

  console.log('Part 1:', countScore(p1.length > 0 ? p1 : p2));

  const createDecksImage = (p1: Array<number>, p2: Array<number>): string => {
    return p1.join(',') + '|' + p2.join(',');
  }

  // true if player 1 wins
  const runPart2Game = (gameNum: number, p1: Array<number>, p2: Array<number>): boolean => {
    // console.log(`Game ${gameNum}, p1 =`, p1, 'p2 =', p2);
    const deckHistory: Array<string> = [createDecksImage(p1, p2)];
    while (p1.length > 0 && p2.length > 0) {
      const p1Card = p1.shift()!, p2Card = p2.shift()!;
      if (p1.length >= p1Card && p2.length >= p2Card) {
        runPart2Game(++gameNum, p1.slice(0, p1Card), p2.slice(0, p2Card))
          ? p1.push(p1Card, p2Card)
          : p2.push(p2Card, p1Card);
      }
      else if (p1Card > p2Card) p1.push(p1Card, p2Card);
      else p2.push(p2Card, p1Card);

      const decksImage = createDecksImage(p1, p2);
      if (deckHistory.includes(decksImage)) {
        // console.log('Winner by repetition Player 1');
        return true;
      } else {
        deckHistory.push(decksImage);
      }
    }
    // console.log(`Winner by collection Player ${p1.length > 0 ? 1 : 2}`);
    return p1.length > 0;
  }

  p1 = [...initP1], p2 = [...initP2];
  console.log('Part 2:', countScore(runPart2Game(1, p1, p2) ? p1 : p2));
}

const day22TestData =
  `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

function day22Test() {
  console.log("\nTEST\n");

  runDay22Logic(day22TestData);
}

function day22() {
  const input: string = require('fs').readFileSync('./input22.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay22Logic(input);
}

day22Test();
day22();
