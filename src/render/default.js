import _ from 'lodash';

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

  if (node.type === 'updated') {
    return [
      `${' '.repeat(indent + 2)}- ${node.name}: ${stringify(node.oldValue, indent)}`,
      `${' '.repeat(indent + 2)}+ ${node.name}: ${stringify(node.newValue, indent)}`,
    ];
  }

  return `${' '.repeat(indent + 2)}${typeToPrefix[node.type] || ' '} ${node.name}: ${stringify(node.value || node.children, indent)}`;
};

export default (ast) => {
  const res = ast.map(node => renderNode(node, 0));
  return `{\n${_.flatten(res).join('\n')}\n}`;
};
