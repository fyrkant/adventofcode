import { data } from './data/21';
import { strictEqual } from 'assert';
import * as R from 'remeda';
import { splitMap } from '../utils';

const testDataString = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;
type Data = {
  ingredients: Array<string>;
  allergens: Array<string>;
};
const parseLine = (input: string): Data => {
  const [ingredientString, allergenString] = input.split(' (contains ');
  const ingredients = ingredientString.split(' ');
  const allergens = allergenString
    .substr(0, allergenString.length - 1)
    .split(', ');

  return { ingredients, allergens };
};

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};

const testData = makeData(testDataString);
const countItems = R.reduce((p, c: string) => {
  const count = R.pathOr(p, [c], 0);
  return { ...p, [c]: count + 1 };
}, {} as Record<string, number>);

const findRealIndices = (
  record: Record<string, string[]>
): Record<string, string[]> => {
  let entries = Object.entries(record);
  let finalEntries: [string, string[]][] = [];
  while (true) {
    const single = entries.find(([, val]) => val.length === 1);
    if (!single) {
      return finalEntries.reduce((p, [key, val]) => {
        return { ...p, [key]: val };
      }, {});
    }
    finalEntries.push(single);
    entries = entries.map(([key, val]) => {
      return [key, val.filter((x) => x !== single[1][0])];
    });
  }
};

const doStuff = (foods: Data[]) => {
  const allIngredients = R.flatMap(foods, R.prop('ingredients'));
  const uniqueIngredients = R.uniq(allIngredients);
  const allAllergens = R.uniq(R.flatMap(foods, R.prop('allergens')));
  const allergenList = R.mapToObj(allAllergens, (x) => [
    x,
    R.clone(uniqueIngredients),
  ]);

  const foundAllergenicIngredient: string[] = [];

  foods.forEach((food) => {
    const { ingredients, allergens } = food;
    allergens.forEach((allergen) => {
      const list = allergenList[allergen];

      const newList = R.difference(
        R.intersection(list, ingredients),
        foundAllergenicIngredient
      );
      if (newList.length === 1) {
        foundAllergenicIngredient.push(newList[0]);
        Object.entries(allergenList).forEach(([key, val]) => {
          allergenList[key] = R.difference(val, newList);
        });
      }

      // debugger;
      allergenList[allergen] = newList;
    });
  });
  const realOnes = findRealIndices(allergenList);
  return Object.entries(realOnes)
    .map(([key, [val]]) => {
      return { ingredient: val, allergen: key };
    })
    .sort((a, b) => {
      return a.allergen.localeCompare(b.allergen);
    })
    .map(R.prop('ingredient'))
    .join(',');
};

// console.log(doStuff(testData));
console.log(doStuff(makeData(data)));
