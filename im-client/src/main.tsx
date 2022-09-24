import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import MessageProvider from "./components/message/message";
import { Provider } from "react-redux";
import store from "./store/index";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

ReactDOM.createRoot(
  document.getElementById("message_container") as HTMLElement
).render(<MessageProvider />);
