import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parser';
import renders from './renders';

const buildAst = (object1, object2) => {
  const propertyNames = _.union(_.keys(object1), _.keys(object2));
  const ast = propertyNames.reduce((acc, name) => {
    if (!_.has(object2, name)) {
      return [...acc, {
        type: 'removed',
        name,
        value: object1[name],
      }];
    }
    if (!_.has(object1, name)) {
      return [...acc, {
        type: 'added',
        name,
        value: object2[name],
      }];
    }
    if (_.isObject(object1[name]) && _.isObject(object2[name])) {
      return [...acc, {
        type: 'nested',
        name,
        children: buildAst(object1[name], object2[name]),
      }];
    }
    if (object1[name] !== object2[name]) {
      return [...acc, {
        type: 'updated',
        name,
        oldValue: object1[name],
        newValue: object2[name],
      }];
    }
    return [...acc, {
      type: 'original',
      name,
      value: object1[name],
    }];
  }, []);
  return ast;
};

const genDiff = (configPath1, configPath2, renderType = 'default') => {
  const ext1 = extname(configPath1).toLowerCase();
  const ext2 = extname(configPath2).toLowerCase();
  const parseData1 = getParser(ext1);
  const parseData2 = getParser(ext2);
  const configData1 = readFileSync(configPath1, 'utf-8');
  const configData2 = readFileSync(configPath2, 'utf-8');
  const object1 = parseData1(configData1);
  const object2 = parseData2(configData2);
  const render = renders[renderType];
  return render(buildAst(object1, object2));
};

export default genDiff;
