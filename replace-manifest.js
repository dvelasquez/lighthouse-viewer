const manifest = {
  "category-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const DetailsRenderer = require("./details-renderer");
'use strict';`,
  "crc-details-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const DetailsRenderer = require("./details-renderer");

'use strict';`,
  "details-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const CriticalRequestChainRenderer = require("./crc-details-renderer");
const SnippetRenderer = require("./snippet-renderer");

'use strict';`,
  "dom.js": `
const Util = require("./util");

'use strict';`,
  "i18n.js": `'use strict';`,
  "logger.js": `'use strict';`,
  "performance-category-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const CategoryRenderer = require("./category-renderer");

'use strict';`,
  "psi.js": `
const DOM = require("./dom");
const Util = require("./util");
const DetailsRenderer = require("./details-renderer");
const PerformanceCategoryRenderer = require("./performance-category-renderer");

'use strict';`,
  "pwa-category-renderer.js": `
const Util = require("./util");
const CategoryRenderer = require("./category-renderer");

'use strict';`,
  "report-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const DetailsRenderer = require("./details-renderer");
const CategoryRenderer = require("./category-renderer");
const PerformanceCategoryRenderer = require("./performance-category-renderer");
const PwaCategoryRenderer = require("./pwa-category-renderer");
const I18n = require("./i18n");

'use strict';`,
  "report-ui-features.js": `
const DOM = require("./dom");
const Util = require("./util");

'use strict';`,
  "snippet-renderer.js": `
const DOM = require("./dom");
const Util = require("./util");
const DetailsRenderer = require("./details-renderer");

'use strict';`,
  "util.js": `
const I18n = require("./i18n");

'use strict';`
};

module.exports = manifest;
