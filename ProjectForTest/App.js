/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import Main from './components/MainComponent.js';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './components/LoadingComponent';

const { persistor, store } = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<Loading />}
        persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}

