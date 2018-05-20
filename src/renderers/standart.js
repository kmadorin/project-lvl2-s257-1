import _ from 'lodash';

const stringify = (val, indent) => {
    if (!_.isObject(val)) {
      return val;
    }
    return `{\n${_.keys(val).map(key =>
      `${' '.repeat(indent + 8)}${key}: ${val[key]}`).join('\n')}\n${' '.repeat(indent + 4)}}`;
};

const renderNode = (node, indent) => {
  const makeStr = (propertyName, value, sign) => {
    return `${' '.repeat(indent + 2)}${sign || ' '} ${propertyName}: ${stringify(value, indent)}`;
  };

  const stringifyNode = {
    nested: (node, indent) => {
      const res = node.children.map(child => renderNode(child, indent + 4));
      return `${' '.repeat(indent + 4)}${node.name}: {\n${_.flatten(res).join('\n')}\n${' '.repeat(indent + 4)}}`;
    },
    original: (node, indent) => {
      return makeStr(node.name, node.value);
    },
    updated: (node, indent) => {
      const res = [makeStr(node.name, node.oldValue, '-'),
                   makeStr(node.name, node.newValue, '+'),]
      return `${_.flatten(res).join('\n')}`;
    },

    removed: (node, indent) => {
      return makeStr(node.name, node.value, '-');
    },
    added: (node, indent) => {
      return makeStr(node.name, node.value, '+');
    }
  }

  return stringifyNode[node.type](node, indent);
};

export default (ast) => {
  const res = ast.map(node => renderNode(node, 0));
  return `{\n${_.flatten(res).join('\n')}\n}`;
};
