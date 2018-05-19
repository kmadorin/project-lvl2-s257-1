import plainRender from './plain';
import defaultRender from './default';
import jsonRender from './json';

const renders = {
  default: defaultRender,
  plain: plainRender,
  json: jsonRender,
};

export default renderFormat => data => renders[`${renderFormat}`](data);
