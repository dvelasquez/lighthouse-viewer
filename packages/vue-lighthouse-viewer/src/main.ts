import Vue from 'vue';
import App from './App.vue';

const app = document.querySelector<HTMLDivElement>('#vue-app')!;

new Vue({
  render: (h) => h(App),
}).$mount(app);
