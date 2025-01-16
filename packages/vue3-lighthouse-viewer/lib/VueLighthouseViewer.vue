<template>
  <div :ref="setElementRef"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { renderReport, Result } from 'lighthouse-viewer';

const props = defineProps<{
  json: Result
}>();

let elementRef: HTMLElement | null = null;

// Template ref callback function
const setElementRef = (el: HTMLElement | null) => {
  elementRef = el;
  if (el) {
    generateReport();
  }
};

const generateReport = () => {
  if (elementRef) {
    const renderedReport = renderReport(props.json, {});
    elementRef.innerHTML = '';
    elementRef.appendChild(renderedReport);
  }
};

onMounted(() => {
  generateReport();
});

watch(
  () => props.json,
  (newValue: Object, oldValue: Object) => {
    if (newValue !== oldValue) {
      generateReport();
    }
  }
);
</script>