import fs from 'fs';
import _ from 'lodash';

const compareObjects = (firstObject, secondObject) => {
  const firstObjectChanges = _.keys(firstObject).reduce((acc, key) => {
    if (!_.has(secondObject, key)) {
      return `${acc}\n  - ${key}: ${firstObject[key]}`;
    }
    if (secondObject[key] !== firstObject[key]) {
      return `${acc}\n  + ${key}: ${secondObject[key]}\n  - ${key}: ${firstObject[key]}`;
    }
    return `${acc}    ${key}: ${firstObject[key]}`;
  }, '');

  const differenceString = _.keys(secondObject).reduce((acc, key) => {
    if (!_.has(firstObject, key)) {
      return `${acc}\n  + ${key}: ${secondObject[key]}`;
    }
    return acc;
  }, firstObjectChanges);

  return differenceString;
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfig = fs.readFileSync(firstConfigPath, 'utf-8');
  const secondConfig = fs.readFileSync(secondConfigPath, 'utf-8');
  const firstObject = JSON.parse(firstConfig);
  const secondObject = JSON.parse(secondConfig);
  return `{\n${compareObjects(firstObject, secondObject)}\n}`;
};

export default genDiff;
