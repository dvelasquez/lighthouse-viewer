<template>
  <div v-html="template"></div>
</template>

<script>
import htmlTemplate from "../report-source/templates.html";

export default {
  name: "VueReportTemplate",
  props: {
    template: {
      type: String,
      default: htmlTemplate
    }
  }
};
</script>

<style></style>
