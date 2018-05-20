import _ from 'lodash';

const stringify = (val, indent) => {
  if (!_.isObject(val)) {
    return val;
  }
  return `{\n${_.keys(val).map(key =>
    `${' '.repeat(indent + 8)}${key}: ${val[key]}`).join('\n')}\n${' '.repeat(indent + 4)}}`;
};

const renderNode = (node, indent) => {
  const makeStr = (propName, value, sign) =>
    `${' '.repeat(indent + 2)}${sign || ' '} ${propName}: ${stringify(value, indent)}`;

  const stringifyNode = {
    nested: () => {
      const res = node.children.map(child => renderNode(child, indent + 4));
      return makeStr(node.name, `{\n${_.flatten(res).join('\n')}\n${' '.repeat(indent + 4)}}`);
    },
    original: () => makeStr(node.name, node.value),
    updated: () => {
      const res = [
        makeStr(node.name, node.oldValue, '-'),
        makeStr(node.name, node.newValue, '+'),
      ];
      return `${_.flatten(res).join('\n')}`;
    },

    removed: () => makeStr(node.name, node.value, '-'),
    added: () => makeStr(node.name, node.value, '+'),
  };

  return stringifyNode[node.type]();
};

export default (ast) => {
  const res = ast.map(node => renderNode(node, 0));
  return `{\n${_.flatten(res).join('\n')}\n}`;
};
