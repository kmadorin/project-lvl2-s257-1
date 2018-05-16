import fs from 'fs';
import _ from 'lodash';

const compareObjects = (firstObject, secondObject) => {
  const keys = _.union(_.keys(firstObject), _.keys(secondObject));

  const differences = keys.map((key) => {
    if (!_.has(firstObject, key)) {
      return `  + ${key}: ${secondObject[key]}`;
    }

    if (!_.has(secondObject, key)) {
      return `  - ${key}: ${firstObject[key]}`;
    }

    const changes = secondObject[key] !== firstObject[key] ? `+ ${key}: ${secondObject[key]}\n  -` : ' ';
    return `  ${changes} ${key}: ${firstObject[key]}`;
  });

  return differences.join('\n');
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfig = fs.readFileSync(firstConfigPath, 'utf-8');
  const secondConfig = fs.readFileSync(secondConfigPath, 'utf-8');
  const firstObject = JSON.parse(firstConfig);
  const secondObject = JSON.parse(secondConfig);
  return `{\n${compareObjects(firstObject, secondObject)}\n}`;
};

export default genDiff;
