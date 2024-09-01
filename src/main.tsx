import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import locale from 'antd/locale/zh_CN';
import { ConfigProvider } from "antd";
import App from "./app";
import "./style/index.css";
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  </Provider>
);
