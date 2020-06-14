import Vue from 'vue';
import VueLighthouseViewer from '..';
import reportJson from './report.json';

const vueAppElement = document.getElementById('vue-app');
if (vueAppElement) {
  const vueApp = new Vue({
    el: '#vue-app',
    name: 'VueApp',
    template: `
      <div>
        <h1>Vue 2 APP</h1>
        <VueLighthouseViewer v-if="json" :json="json" />
      </div>`,
    components: {
      VueLighthouseViewer,
    },
    data: () => {
      return {
        json: reportJson,
      };
    },
  });
}
