import fs from 'fs';
import _ from 'lodash';

const compareObjects = (firstObject, secondObject) => {
  const firstObjectChanges = _.keys(firstObject).reduce((acc, key) => {
    if (!_.has(secondObject, key)) {
      return `${acc}  - ${key}: ${firstObject[key]}\n`;
    }
    if (secondObject[key] !== firstObject[key]) {
      return `${acc}  + ${key}: ${secondObject[key]}\n  - ${key}: ${firstObject[key]}\n`;
    }
    return `${acc}    ${key}: ${firstObject[key]}\n`;
  }, '');

  const differenceString = _.keys(secondObject).reduce((acc, key) => {
    if (!_.has(firstObject, key)) {
      return `${acc}  + ${key}: ${secondObject[key]}\n`;
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
  return `{\n${compareObjects(firstObject, secondObject)}}`;
};

export default genDiff;
