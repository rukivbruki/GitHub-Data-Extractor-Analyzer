// src/main.js
import Vue from "vue";
import App from "./App";

import { Button, Progress } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueFormulate from "@braid/vue-formulate";
import "../node_modules/@braid/vue-formulate/themes/snow/snow.scss";

Vue.use(VueFormulate);
Vue.component(Button.name, Button);
Vue.component(Progress.name, Progress);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
