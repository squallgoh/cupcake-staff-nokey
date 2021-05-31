import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import combineReducers from "./reducers";

const configureStore = (initialState = {}) => {
  return createStore(combineReducers, initialState, applyMiddleware(thunk));
};

export default configureStore;
