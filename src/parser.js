import { safeLoad } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.ini': iniParse,
};

export default extension => data => parsers[extension](data);
