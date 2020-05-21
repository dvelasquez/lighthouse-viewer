<template>
  <div id="app">
    <VueLighthouseViewer v-if="json" :json="json" />
  </div>
</template>

<script>
import VueLighthouseViewer from "./components/VueLighthouseViewer.js";

export default {
  name: "App",
  components: {
    VueLighthouseViewer
  },
  data: () => {
    return {
      json: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: async function() {
      try {
        const result = await fetch("./report.json");
        this.json = await result.json();
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
