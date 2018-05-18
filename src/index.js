import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parser';

const buildAst = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const ast = keys.reduce((acc, key) => {
    if (!_.has(object2, key)) {
      return [...acc, { key, prefix: '-', value: object1[key] }];
    }
    if (!_.has(object1, key)) {
      return [...acc, { key, prefix: '+', value: object2[key] }];
    }
    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      return [...acc, { key, prefix: '', value: buildAst(object1[key], object2[key]) }];
    }
    if (object1[key] !== object2[key]) {
      return [...acc, { key, prefix: '-', value: object1[key] }, { key, prefix: '+', value: object2[key] }];
    }
    return [...acc, { key, prefix: '', value: object1[key] }];
  }, []);
  return ast;
};

const renderDiff = (ast, spacesNum = 0) => {
  const stringify = (val) => {
    if (_.isArray(val)) {
      return `{\n${renderDiff(val, spacesNum + 4)}\n${' '.repeat(spacesNum + 4)}}`;
    }
    if (_.isObject(val)) {
      return `{\n${_.keys(val).map(key => `${' '.repeat(spacesNum + 8)}${key}: ${val[key]}`).join('\n')}\n${' '.repeat(spacesNum + 4)}}`;
    }
    return val;
  };
  const res = ast.map(el => `${' '.repeat(spacesNum + 2)}${el.prefix || ' '} ${el.key}: ${stringify(el.value)}`);
  return res.join('\n');
};

const genDiff = (configPath1, configPath2) => {
  const ext1 = extname(configPath1).toLowerCase();
  const ext2 = extname(configPath2).toLowerCase();
  const parseData1 = getParser(ext1);
  const parseData2 = getParser(ext2);
  const configData1 = readFileSync(configPath1, 'utf-8');
  const configData2 = readFileSync(configPath2, 'utf-8');
  const object1 = parseData1(configData1);
  const object2 = parseData2(configData2);
  return `{\n${renderDiff(buildAst(object1, object2))}\n}`;
};

export default genDiff;
