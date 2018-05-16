import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parser';

const compareObjects = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const differences = keys.map((key) => {
    if (!_.has(object1, key)) {
      return `  + ${key}: ${object2[key]}`;
    }
    if (!_.has(object2, key)) {
      return `  - ${key}: ${object1[key]}`;
    }
    const changes = object2[key] !== object1[key] ? `+ ${key}: ${object2[key]}\n  -` : ' ';
    return `  ${changes} ${key}: ${object1[key]}`;
  });

  return differences.join('\n');
};

const genDiff = (configPath1, configPath2) => {
  const extension = extname(configPath1);
  const parseData = getParser(extension);
  const configData1 = readFileSync(configPath1, 'utf-8');
  const configData2 = readFileSync(configPath2, 'utf-8');
  const object1 = parseData(configData1);
  const object2 = parseData(configData2);
  return `{\n${compareObjects(object1, object2)}\n}`;
};

export default genDiff;
