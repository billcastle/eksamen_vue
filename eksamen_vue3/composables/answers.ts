import { nanoid } from 'nanoid';

export const getRandomSetFromArray = (array: Array<String>, count: number) => {
  if (count > array.length) {
    console.error('Count cannot be greater than the array length.');
    return new Set();
  }

  const randomSet = new Set();

  while (randomSet.size < count) {
    const randomIndex = Math.floor(Math.random() * array.length);
    randomSet.add(array[randomIndex]);
  }

  return randomSet;
};

export const generateRadioAnswerSet = (count: number = 1) => {
  const answers = [];
  const randomSet = getRandomSetFromArray(CAPITAL_CITY, count);
  const setIterator = randomSet.values();

  for (const entry of setIterator) {
    console.log('entry: ', entry);
    answers.push({
      value: entry,
      label: entry,
      id: nanoid(),
    });
  }

  return answers;
};

export function randomizeArrayValues(inputArray: Array<any>) {
  const randomizedArray = [...inputArray]; // Clone the input array
  for (let i = randomizedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomizedArray[i], randomizedArray[j]] = [
      randomizedArray[j],
      randomizedArray[i],
    ]; // Swap elements
  }
  return randomizedArray;
}
