import React from "react";
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider } from './contexts/ToastContext';
import Routes from "./Routes";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Routes />
      </ToastProvider>
    </Provider>
  );
}

export default App;
