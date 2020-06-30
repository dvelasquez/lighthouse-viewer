import Vue from 'vue';
import { DOM, ReportRenderer, ReportUIFeatures, Logger } from 'lighthouse-viewer';
import VueReportTemplate from './VueReportTemplate';

export default Vue.extend<any, any, any, any>({
  name: 'VueLighthouseViewer',
  components: {
    VueReportTemplate,
  },
  render(h) {
    return h('div', {}, [
      h('div', { class: 'lh-root lh-vars' }, [
        h('vue-report-template'),
        h('main', { class: 'vue-lighthouse-viewer' }),
        h('div', { attrs: { id: 'lh-log' } }),
      ]),
    ]);
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
    document.addEventListener('lh-log', (e: CustomEventInit) => {
      const lhLogElement = document.querySelector('#lh-log');
      if (lhLogElement) {
        const logger = new Logger(lhLogElement);
        switch (e.detail.cmd) {
          case 'log':
            logger.log(e.detail.msg);
            break;
          case 'warn':
            logger.warn(e.detail.msg);
            break;
          case 'error':
            logger.error(e.detail.msg);
            break;
          case 'hide':
            logger.hide();
            break;
          default:
        }
      }
    });
    this.generateReport();
  },
  methods: {
    generateReport: function () {
      const dom = new DOM(document);
      const renderer = new ReportRenderer(dom);
      const container = document.querySelector('main.vue-lighthouse-viewer');
      renderer.renderReport(this.json, container);
      const features = new ReportUIFeatures(dom);
      features.initFeatures(this.json);
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
