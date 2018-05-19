import plainRender from './plain';
import defaultRender from './default';

const renders = {
  default: defaultRender,
  plain: plainRender,
};

export default renderFormat => data => renders[`${renderFormat}`](data);
