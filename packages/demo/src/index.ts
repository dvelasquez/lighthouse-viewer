import Vue from 'vue';
import VueLighthouseViewer from 'vue-lighthouse-viewer';

const app = new Vue({
  el: '#app',
  name: 'App',
  template: `
      <div>
        <h1>It should be something awesome here</h1>
        <VueLighthouseViewer v-if="json" :json="json" />
      </div>`,
  components: {
    VueLighthouseViewer,
  },
  data: () => {
    return {
      json: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: async function () {
      try {
        const result = await fetch('./report.json');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.json = await result.json();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
