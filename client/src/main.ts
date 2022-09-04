import { createApp } from "vue";
import App from "./App.vue";
import { setupGlobalComponent } from "./plugins/antd";
import 'ant-design-vue/dist/antd.css';

createApp(App).mount("#app");
const app = createApp(App);
// 全局 antd 组件
setupGlobalComponent(app);
app.mount("#app");
