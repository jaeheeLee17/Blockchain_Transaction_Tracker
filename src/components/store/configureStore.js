import { useCallback, useEffect } from "react";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import withReduxSaga from "next-redux-saga"; // next와 redux-saga를 연결하기 위한 라이브러리
import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";
import * as modules from "./modules";
import rootSaga from "./modules/rootSaga";

const reducers = combineReducers(modules);
const rootReducer = (state, action) => {
  if (action.type === "user/USER_LOGOUT") {
    state = undefined;
  }
  return reducers(state, action);
};
const middlewares = [];

const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

const configure = (preloadedState) => {
  // 개발 모드일 때만 Redux Devtools 적용

  // const isDev = process.env.NODE_ENV === "development"

  // const reduxCompose = useCallback(() => {
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  // }, [])
  //
  // const devtools = isDev && reduxCompose()
  // const composeEnhancers = devtools || compose
  const composeEnhancers = compose;

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(configure, {
  debug: process.env.NODE_ENV !== "production",
});

export default wrapper;
