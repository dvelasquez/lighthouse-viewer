<script lang="ts">
  import SvelteLighthouseViewer from "../lib/SvelteLighthouseViewer.svelte";
  import reportJson from './assets/report-v8.0.0.json';

</script>

<main>
  <SvelteLighthouseViewer json={reportJson}></SvelteLighthouseViewer>
</main>

<style>
</style>
