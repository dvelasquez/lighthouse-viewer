<template>
  <div id="app">
    <h1>Vue 2 APP</h1>
    <VueLighthouseViewer :json="json"></VueLighthouseViewer> 
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import reportJson from './static/report.json'
import VueLighthouseViewer from '../lib/main';

export default Vue.extend({
    name: 'VueApp',
    components: {
      VueLighthouseViewer,
    },
    data: () => {
      return {
        json: reportJson,
      };
    },
  })
</script>

<style>
</style>