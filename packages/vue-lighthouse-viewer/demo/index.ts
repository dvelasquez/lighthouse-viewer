import Vue from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './App.vue';

const vueAppElement = document.getElementById('vue-app');
if (vueAppElement) {
  new Vue(App).$mount('#vue-app');
}
