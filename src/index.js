import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parser';

// {
//   keyName: ['name', '+/-/', 'str'/'[children]]',
// }

const diffAst = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const ast = keys.reduce((acc, key) => {
    if (!_.has(object2, key)) {
      return [...acc, [key, '-', object1[key]]];
    }
    if (!_.has(object1, key)) {
      return [...acc, [key, '+', object2[key]]];
    }
    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      return [...acc, [key, '', diffAst(object1[key], object2[key])]];
    }
    if (object1[key] !== object2[key]) {
      return [...acc, [key, '-', object1[key]], [key, '+', object2[key]]];
    }
    return [...acc, [key, '', object1[key]]];
  }, []);
  return ast;
};

const renderDiff = (ast, spacesNum = 2) => {
  const valueToString = (val) => {
    if (_.isArray(val)) {
      return `{\n${renderDiff(val, spacesNum + 4)}\n${' '.repeat(spacesNum)}  }`;
    }
    if (_.isObject(val)) {
      return `{\n${_.keys(val).map(key => `${' '.repeat(spacesNum + 4)}  ${key}: ${val[key]}`).join('\n')}\n${' '.repeat(spacesNum)}  }`;
    }
    return val;
  };
  const res = ast.map(el => `${' '.repeat(spacesNum)}${el[1] || ' '} ${el[0]}: ${valueToString(el[2])}`);
  return res.join('\n');
};

const genDiff = (configPath1, configPath2) => {
  const extension = extname(configPath1);
  const parseData = getParser(extension);
  const configData1 = readFileSync(configPath1, 'utf-8');
  const configData2 = readFileSync(configPath2, 'utf-8');
  const object1 = parseData(configData1);
  const object2 = parseData(configData2);
  return `{\n${renderDiff(diffAst(object1, object2))}\n}`;
};

export default genDiff;
