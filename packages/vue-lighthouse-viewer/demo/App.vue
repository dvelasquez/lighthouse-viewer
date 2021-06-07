<template>
	<div>
		<h1>Vue 2 APP</h1>
		<VueLighthouseViewer v-if="json" :json="json"/>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue';
  import VueLighthouseViewer from '..';
  import reportJson from './report-v8.0.0.json';

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
