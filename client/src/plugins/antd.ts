import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  Card,
  Spin,
  Modal,
} from "ant-design-vue";
import { App } from "vue";

const FormItem = Form.Item;

const antdComponents = [
  Button,
  Row,
  Col,
  Input,
  Form,
  FormItem,
  Checkbox,
  Card,
  Spin,
  Modal,
];
/**
 * 全局 antd 组件
 * @param app
 */
export function setupGlobalComponent(app: App) {
  antdComponents.forEach((component) => {
    app.use(component);
  });
}
