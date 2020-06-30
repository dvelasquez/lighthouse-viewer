import Vue from 'vue';
import { template } from 'lighthouse-viewer';

export default Vue.extend({
  name: 'VueReportTemplate',
  render(h) {
    return h('div', {
      domProps: {
        innerHTML: template,
      },
    });
  },
  props: {
    template: {
      type: String,
      default: template,
    },
  },
});
