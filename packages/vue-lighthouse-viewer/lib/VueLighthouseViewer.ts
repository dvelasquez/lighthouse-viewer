import Vue from 'vue';
import { renderReport, type Result } from 'lighthouse-viewer';

interface Props {
  json: Result;
}

interface Methods {
  generateReport(): void;
}

interface Computed {
  computedJson: Result;
}

export default Vue.extend<Record<string, never>, Methods, Computed, Props>({
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
    computedJson: function (): Result {
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
