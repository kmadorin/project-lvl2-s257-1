import { flatten, isObject, compact } from 'lodash';

const renderNode = (node, prefixName) => {
  if (node.type === 'original') {
    return '';
  }

  const plainNode = {
    ...node,
    name: `${prefixName ? `${prefixName}.` : ''}${node.name}`,
    action: node.type,
  };

  if (node.type === 'nested') {
    const res = plainNode.children.map(child => renderNode(child, plainNode.name));
    return flatten(res);
  }

  if (node.type === 'added') {
    const addDescription = isObject(plainNode.value) ? 'complex value' : `value: '${plainNode.value}'`;
    plainNode.description = ` with ${addDescription}`;
  }

  if (node.type === 'updated') {
    const oldVal = isObject(plainNode.oldValue) ? 'complex value' : `'${plainNode.oldValue}'`;
    const newVal = isObject(plainNode.newValue) ? 'complex value' : `'${plainNode.newValue}'`;

    const updDescription = `${oldVal} to ${newVal}`;
    plainNode.description = `. From ${updDescription}`;
  }

  return `Property '${plainNode.name}' was ${plainNode.action}${plainNode.description || ''}`;
};

export default (ast) => {
  const res = ast.map(node => renderNode(node));
  return compact(flatten(res)).join('\n');
};
