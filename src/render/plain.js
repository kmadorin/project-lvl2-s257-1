import { flatten, isObject, compact } from 'lodash';

const renderNode = (node, prefixName) => {
  if (node.type === 'original') {
    return '';
  }

  const val = {
    name: `${prefixName ? `${prefixName}.` : ''}${node.name}`,
    action: node.type,
  };

  if (node.type === 'nested') {
    const res = node.children.map(child => renderNode(child, val.name));
    return flatten(res);
  }

  if (node.type === 'added') {
    const addDescription = isObject(node.value) ? 'complex value' : `value: '${node.value}'`;
    val.description = ` with ${addDescription}`;
  }

  if (node.type === 'updated') {
    const oldVal = isObject(node.oldValue) ? 'complex value' : `'${node.oldValue}'`;
    const newVal = isObject(node.newValue) ? 'complex value' : `'${node.newValue}'`;

    const updDescription = `${oldVal} to ${newVal}`;
    val.description = `. From ${updDescription}`;
  }

  return `Property '${val.name}' was ${val.action}${val.description || ''}`;
};

export default (ast) => {
  const res = ast.map(node => renderNode(node));
  return compact(flatten(res)).join('\n');
};
