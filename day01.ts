function day01() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./Day01/Input01.txt', 'utf8');

  const inputArray: Array<number> = input.split('\n').map(str => parseInt(str, 10));
  // console.log(inputArray);

  /* PART 1 */

  // find two entries that sum to 2020
  // let i = 0, j = 0;
  // for (i = 0; i < inputArray.length; i++) {
  //   for (j = i + 1; j < inputArray.length; j++) {
  //     if (inputArray[i] + inputArray[j] === 2020) break;
  //   }
  //   if (inputArray[i] + inputArray[j] === 2020) break;
  // }

  // const first = inputArray[i];
  // const second = inputArray[j];

  // console.log(`i=${i}; j=${j}; first=${first}; second=${second}; product=${first * second}`);

  /* PART 2 */

  // find three entries that sum to 2020
  let i = 0, j = 0, k = 0;
  for (i = 0; i < inputArray.length; i++) {
    for (j = i + 1; j < inputArray.length; j++) {
      for (k = j + 1; k < inputArray.length; k++) {
        if (inputArray[i] + inputArray[j] + inputArray[k] === 2020) break;
      }
      if (inputArray[i] + inputArray[j] + inputArray[k] === 2020) break;
    }
    if (inputArray[i] + inputArray[j] + inputArray[k] === 2020) break;
  }

  const first = inputArray[i];
  const second = inputArray[j];
  const third = inputArray[k]

  console.log(`i=${i}; j=${j}; k=${k}; first=${first}; second=${second}; third=${third}; product=${first * second * third}`);
}

day01();
