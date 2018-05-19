import plainRender from './plain';
import defaultRender from './default';

export default {
  default: defaultRender,
  plain: plainRender,
  json: JSON.stringify,
};
