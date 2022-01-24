import Vue from 'vue';
import { renderReport } from 'lighthouse-viewer';

export default Vue.extend<any, any, any, any>({
  name: 'VueLighthouseViewer',
  components: {},
  render(h) {
    return h('div', {}, []);
  },
  props: {
    json: {
      type: Object,
      required: true,
    },
  },
  computed: {
    computedJson: function (): any {
      return this.json;
    },
  },
  mounted() {
    this.generateReport();
  },
  methods: {
    generateReport: function () {
      const renderedReport = renderReport(this.json, {});
      this.$el.innerHTML = '';
      this.$el.appendChild(renderedReport);
    },
  },
  watch: {
    json: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.generateReport();
      }
    },
  },
});
