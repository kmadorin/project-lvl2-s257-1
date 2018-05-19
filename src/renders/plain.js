import { flatten, isObject, compact } from 'lodash';

const makeDescription = (node) => {
  if (node.type === 'added') {
    return isObject(node.value) ? 'complex value' : `value: '${node.value}'`;
  }
  if (node.type === 'updated') {
    const oldVal = isObject(node.oldValue) ? 'complex value' : `'${node.oldValue}'`;
    const newVal = isObject(node.newValue) ? 'complex value' : `'${node.newValue}'`;
    return `${oldVal} to ${newVal}`;
  }
  return '';
};

const renderNode = (node, prefixName) => {
  if (node.type === 'original') {
    return '';
  }

  const plainNode = {
    ...node,
    fullName: `${prefixName ? `${prefixName}.` : ''}${node.name}`,
    action: node.type,
  };

  if (node.type === 'nested') {
    const res = plainNode.children.map(child => renderNode(child, plainNode.fullName));
    return flatten(res);
  }

  if (node.type === 'added') {
    plainNode.description = ` with ${makeDescription(plainNode)}`;
  }

  if (node.type === 'updated') {
    plainNode.description = `. From ${makeDescription(plainNode)}`;
  }

  return `Property '${plainNode.fullName}' was ${plainNode.action}${plainNode.description || ''}`;
};

export default (ast) => {
  const res = ast.map(node => renderNode(node));
  return compact(flatten(res)).join('\n');
};
