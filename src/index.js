import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parser';

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
        type: 'changed',
        name,
        oldValue: object1[name],
        newValue: object2[name],
      }];
    }
    return [...acc, { type: 'original', name, value: object1[name] }];
  }, []);
  return ast;
};

const typeToPrefix = {
  removed: '-',
  added: '+',
};

const renderNode = (node, indent) => {
  const stringify = (val) => {
    if (_.isArray(val)) {
      const res = val.map(child => renderNode(child, indent + 4));
      return `{\n${_.flatten(res).join('\n')}\n${' '.repeat(indent + 4)}}`;
    }
    if (_.isObject(val)) {
      return `{\n${_.keys(val).map(key =>
        `${' '.repeat(indent + 8)}${key}: ${val[key]}`).join('\n')}\n${' '.repeat(indent + 4)}}`;
    }
    return val;
  };

  if (node.type === 'changed') {
    return [
      `${' '.repeat(indent + 2)}- ${node.name}: ${stringify(node.oldValue, indent)}`,
      `${' '.repeat(indent + 2)}+ ${node.name}: ${stringify(node.newValue, indent)}`,
    ];
  }

  return `${' '.repeat(indent + 2)}${typeToPrefix[node.type] || ' '} ${node.name}: ${stringify(node.value || node.children, indent)}`;
};

const defaultRender = (ast) => {
  const res = ast.map(node => renderNode(node, 0));
  return _.flatten(res).join('\n');
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
  return `{\n${defaultRender(buildAst(object1, object2))}\n}`;
};

export default genDiff;
