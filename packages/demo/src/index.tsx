import Vue from 'vue';
import VueLighthouseViewer from 'vue-lighthouse-viewer';
import { render } from 'react-dom';
import React2LighthouseViewer from 'react2-lighthouse-viewer';
import React, { FC, useEffect, useState } from 'react';

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.json = await result.json();
      } catch (e) {
        console.error(e);
      }
    },
  },
});

const ReactApp: FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('./report.json')
      .then((result) => result.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div>
      <h1>REACT APP</h1>
      {data && <React2LighthouseViewer json={data} />}
    </div>
  );
};

const rootElement = document.getElementById('react-app');
render(<ReactApp />, rootElement);
