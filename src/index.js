import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
  document.querySelector("#root")
);
