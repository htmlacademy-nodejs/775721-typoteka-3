'use strict';

exports.getRandomInteger = (min, max) => {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin + 1)) + intMin;
};

exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);

    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

exports.hasAllExpectedProperties = (object, expectedProperties) => {
  const objectProperties = Object.keys(object);

  return expectedProperties.every((expectedProperty) => objectProperties.includes(expectedProperty));
};
