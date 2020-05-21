import Vue from 'vue';
import htmlTemplate from 'lighthouse-viewer/templates.html';

export default Vue.extend({
  name: 'VueReportTemplate',
  template: `<div v-html="template"></div>`,
  props: {
    template: {
      type: String,
      default: htmlTemplate,
    },
  },
});
