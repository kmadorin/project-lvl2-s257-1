import { safeLoad } from 'js-yaml';
import { parse as iniParse } from 'ini';
import { extname } from 'path';

const parsers = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
  '.ini': iniParse,
};

export default confPath => {
  const extension = extname(confPath).toLowerCase()
  const parser = parsers[extension];
  if (!parser) {
    throw new Error(`unkown format: ${extension}`);
  }
  return parser;
};
