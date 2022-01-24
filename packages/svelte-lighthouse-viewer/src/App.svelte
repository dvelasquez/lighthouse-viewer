<script lang="ts">
  import SvelteLighthouseViewer from "../lib/SvelteLighthouseViewer.svelte";
  import reportJson from './assets/report.json';

</script>

<main>
  <SvelteLighthouseViewer json={reportJson}></SvelteLighthouseViewer>
</main>

<style>
</style>
