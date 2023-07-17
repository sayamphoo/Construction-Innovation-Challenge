import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./global_state/reducers"; // รวม Reducer ที่คุณได้สร้าง
import { BrowserRouter,Routes,Route } from "react-router-dom";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const store = createStore(rootReducer);

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
