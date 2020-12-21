interface Day21Food {
  ingredients: Array<string>;
  allergens: Array<string>;
}

interface Day21Allergen {
  allergen: string;
  possibleIngredients: Array<string>;
}

function parseFoods(input: string): [Array<Day21Food>, Set<string>, Set<string>] {
  const foodStrings = input.split('\n');
  const globalIngredients = new Set<string>();
  const globalAllergens = new Set<string>();
  const foodArray = foodStrings.map(food => {
    const [ingred, allerg] = food.split(' (contains ');
    const ingredients = ingred.split(' ');
    const allergens = allerg.substring(0, allerg.length - 1).split(', ');
    ingredients.forEach(ingred => globalIngredients.add(ingred));
    allergens.forEach(a => globalAllergens.add(a));
    return { ingredients, allergens };
  });
  // console.log('Parsed foods:\n', foodArray);
  // console.log('List of allergens:\n', globalAllergens);
  return [foodArray, globalIngredients, globalAllergens];
}

function runDay21Logic(input: string) {
  const [foodArray, globalIngredients, globalAllergens] = parseFoods(input);

  const allergenArray: Array<Day21Allergen> = [];
  for (const allergen of globalAllergens) {
    const containingFoods = foodArray.filter(food => food.allergens.includes(allergen));
    if (containingFoods.length === 0) continue;

    let possibleIngredients: Array<string> = [...containingFoods[0].ingredients];
    for (let i = 1; i < containingFoods.length; i++) {
      possibleIngredients = possibleIngredients.filter(
        ingred => containingFoods[i].ingredients.includes(ingred)
      );
    }
    allergenArray.push({ allergen, possibleIngredients });
  }
  // console.log('Allergens and their possible ingredients:\n', allergenArray);

  const possibleAllergenIngredients = new Set(allergenArray.map(a => a.possibleIngredients).flat());
  const combinedIngredientsList = foodArray.reduce<Array<string>>((ingredientArray, food) => ingredientArray.concat(food.ingredients), []);
  const nonAllergenIngredients = Array.from(globalIngredients).filter(ingred => !possibleAllergenIngredients.has(ingred));
  // console.log('Non-allergen ingredients:\n', nonAllergenIngredients);

  console.log(`Part 1: ${nonAllergenIngredients.reduce(
    (countSum, ingred) => countSum + combinedIngredientsList.filter(ing => ing === ingred).length,
    0
  )}`);

  const processedAllergens: Array<Day21Allergen> = [];
  while (allergenArray.length > 0) {
    allergenArray.sort((a, b) => a.possibleIngredients.length - b.possibleIngredients.length);
    const allergen = allergenArray[0];
    if (allergen.possibleIngredients.length > 1) {
      console.log(allergenArray);
      throw new Error('Cannot solve part 2');
    }
    const ingredient = allergen.possibleIngredients[0];
    for (let i = 1; i < allergenArray.length; i++) {
      allergenArray[i].possibleIngredients = allergenArray[i].possibleIngredients.filter(ingred => ingred !== ingredient);
    }
    processedAllergens.push(allergenArray.shift()!);
    // console.log(processedAllergens, allergenArray);
  }
  processedAllergens.sort((a, b) => a.allergen < b.allergen ? -1 : 1);
  console.log(`Part 2: ${processedAllergens.map(a => a.possibleIngredients).flat().join(',')}`);
}

const day21TestData =
  `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

function day21Test() {
  console.log("\nTEST\n");

  runDay21Logic(day21TestData);
}

function day21() {
  const input: string = require('fs').readFileSync('./input21.txt', 'utf8');

  console.log("\nACTUAL\n");

  runDay21Logic(input);
}

day21Test();
day21();