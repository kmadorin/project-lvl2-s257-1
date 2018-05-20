import { readFileSync } from 'fs';
import _ from 'lodash';
import getParser from './parser';
import renderers from './renderers';

const diffTypes = [
  {
    type: 'nested',
    check: (config1, config2, key) =>
      _.isObject(config1[key]) && _.isObject(config2[key]),
    fillProps: (config1, config2, func) => ({ children: func(config1, config2) }),
  },
  {
    type: 'original',
    check: (config1, config2, key) => (_.has(config1, key) && _.has(config2, key)
      && (config1[key] === config2[key])),
    fillProps: config1 => ({ value: config1 }),
  },
  {
    type: 'updated',
    check: (config1, config2, key) => (_.has(config1, key) && _.has(config2, key)
      && (config1[key] !== config2[key])),
    fillProps: (config1, config2) =>
      ({ oldValue: config1, newValue: config2 }),
  },
  {
    type: 'removed',
    check: (config1, config2, key) =>
      (_.has(config1, key) && !_.has(config2, key)),
    fillProps: config1 => ({ value: config1 }),
  },
  {
    type: 'added',
    check: (config1, config2, key) =>
      (!_.has(config1, key) && _.has(config2, key)),
    fillProps: (config1, config2) => ({ value: config2 }),
  },
];

const buildAst = (firstConfig = {}, config2 = {}) => {
  const propertyNames = _.union(_.keys(firstConfig), _.keys(config2));
  return propertyNames.map((name) => {
    const { type, fillProps } = _.find(diffTypes, item => item.check(firstConfig, config2, name));
    return { type, name, ...fillProps(firstConfig[name], config2[name], buildAst) };
  });
};

const genDiff = (configPath1, configPath2, renderType = 'standart') => {
  const parseData1 = getParser(configPath1);
  const parseData2 = getParser(configPath2);
  const configData1 = readFileSync(configPath1, 'utf-8');
  const configData2 = readFileSync(configPath2, 'utf-8');
  const object1 = parseData1(configData1);
  const object2 = parseData2(configData2);
  const render = renderers[renderType];
  return render(buildAst(object1, object2));
};

export default genDiff;
