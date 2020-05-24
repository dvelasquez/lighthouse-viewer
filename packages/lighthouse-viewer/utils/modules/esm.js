const topFrom = /'use strict';/;
const categoryRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import DetailsRenderer from './details-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = CategoryRenderer;
    // } else {
    //   self.CategoryRenderer = CategoryRenderer;
    // }`,
    //     to: 'export default CategoryRenderer;',
    from: /class CategoryRenderer/,
    to: 'export default class CategoryRenderer',
  },
});

const crcDetailsRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import DetailsRenderer from './details-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = CriticalRequestChainRenderer;
    // } else {
    //   self.CriticalRequestChainRenderer = CriticalRequestChainRenderer;
    // }`,
    //     to: 'export default CriticalRequestChainRenderer;',
    //   },
    from: /class CriticalRequestChainRenderer/,
    to: 'export default class CriticalRequestChainRenderer',
  },
});
const detailsRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import CriticalRequestChainRenderer from './crc-details-renderer';
import SnippetRenderer from './snippet-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = DetailsRenderer;
    // } else {
    //   self.DetailsRenderer = DetailsRenderer;
    // }`,
    //     to: 'export default DetailsRenderer;',
    from: /class DetailsRenderer/,
    to: 'export default class DetailsRenderer',
  },
});

const dom = () => ({
  import: {
    from: topFrom,
    to: `
import Util from './util';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = DOM;
    // } else {
    //   self.DOM = DOM;
    // }`,
    //     to: 'export default DOM;',
    from: /class DOM/,
    to: 'export default class DOM',
  },
});

const i18n = () => ({
  import: {
    from: topFrom,
    to: ``,
  },
  export: {
    from: /class I18n/,
    to: 'export default class I18n',
  },
});

const logger = () => ({
  import: {
    from: topFrom,
    to: ``,
  },
  export: {
    from: /class Logger/,
    to: 'export default class Logger',
  },
});

const performanceCategoryRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import CategoryRenderer from './category-renderer';`,
  },
  export: {
    from: /class PerformanceCategoryRenderer/,
    to: 'export default class PerformanceCategoryRenderer',
  },
});

const psi = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import DetailsRenderer from './details-renderer';
import PerformanceCategoryRenderer from './performance-category-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = prepareLabData;
    // } else {
    //   self.prepareLabData = prepareLabData;
    // }`,
    //     to: 'export default prepareLabData;',
    from: /function prepareLabData/,
    to: 'export default function prepareLabData',
  },
});

const pwaCategoryRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import Util from './util';
import CategoryRenderer from './category-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = PwaCategoryRenderer;
    // } else {
    //   self.PwaCategoryRenderer = PwaCategoryRenderer;
    // }`,
    //     to: 'export default PwaCategoryRenderer;',
    from: /class PwaCategoryRenderer/,
    to: 'export default class PwaCategoryRenderer',
  },
});

const reportRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import DetailsRenderer from './details-renderer';
import CategoryRenderer from './category-renderer';
import PerformanceCategoryRenderer from './performance-category-renderer';
import PwaCategoryRenderer from './pwa-category-renderer';
import I18n from './i18n';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = ReportRenderer;
    // } else {
    //   self.ReportRenderer = ReportRenderer;
    // }`,
    //     to: 'export default ReportRenderer;',
    from: /class ReportRenderer/,
    to: 'export default class ReportRenderer',
  },
});

const reportUIFeatures = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = ReportUIFeatures;
    // } else {
    //   self.ReportUIFeatures = ReportUIFeatures;
    // }`,
    //     to: 'export default ReportUIFeatures;',
    from: /class ReportUIFeatures/,
    to: 'export default class ReportUIFeatures',
  },
});

const snippetRenderer = () => ({
  import: {
    from: topFrom,
    to: `
import DOM from './dom';
import Util from './util';
import DetailsRenderer from './details-renderer';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = SnippetRenderer;
    // } else {
    //   self.SnippetRenderer = SnippetRenderer;
    // }`,
    //     to: 'export default ReportUIFeatures;',
    from: /class SnippetRenderer/,
    to: 'export default class SnippetRenderer',
  },
});
const utils = () => ({
  import: {
    from: topFrom,
    to: `
import I18n from './i18n';`,
  },
  export: {
    //     from: `if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = Util;
    // } else {
    //   self.Util = Util;
    // }`,
    //     to: 'export default ReportUIFeatures;',
    from: /class Util/,
    to: 'export default class Util',
  },
});

const manifest = {
  'category-renderer.js': categoryRenderer(),
  'crc-details-renderer.js': crcDetailsRenderer(),
  'details-renderer.js': detailsRenderer(),
  'dom.js': dom(),
  'i18n.js': i18n(),
  'logger.js': logger(),
  'performance-category-renderer.js': performanceCategoryRenderer(),
  'psi.js': psi(),
  'pwa-category-renderer.js': pwaCategoryRenderer(),
  'report-renderer.js': reportRenderer(),
  'report-ui-features.js': reportUIFeatures(),
  'snippet-renderer.js': snippetRenderer(),
  'util.js': utils(),
};

module.exports = manifest;
