<script setup lang="ts">
import reportJson from './static/report.json'
import VueLighthouseViewer from '../lib/main'

const json = reportJson
</script>

<template>
  <div id="app">
    <h1>Vue 3 APP</h1>
    <VueLighthouseViewer :json="json" />
  </div>
</template>