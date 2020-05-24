import Vue from 'vue';
import { template } from 'lighthouse-viewer';

export default Vue.extend({
  name: 'VueReportTemplate',
  template: `<div v-html="template"></div>`,
  props: {
    template: {
      type: String,
      default: template,
    },
  },
});
