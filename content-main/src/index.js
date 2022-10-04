/* eslint-disable */
import React, {useEffect} from 'react';
import './tailwind.output.css';
import * as Sentry from "@sentry/react";
// import ReactDOM from 'react-dom';
import './index.css';
// import LandingPage from './pages/LandingPage/LandingPage';
// import MainApp from './pages/MainApp/MainApp';
import axios from 'axios';
// import RouteHandler from './pages/RouteHandler';
import { Provider } from 'react-redux';
// import LandingPage from './pages/LandingPage/LandingPage';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import RouteHandler from './pages/RouteHandler';
import { NotificationsProvider } from '@mantine/notifications';
import { firebaseInit } from './utilities/firebase';
import { MantineProvider } from '@mantine/core';
import { BrowserTracing } from "@sentry/tracing";


// import LandingPage from './pages/LandingPage/LandingPage';

axios.interceptors.request.use((config) => {
  const axiosConfig = {...config};
  if (!axiosConfig.noTrailingSlash) {
    axiosConfig.url = config.url.replace(/\/?(\?|#|$)/, '/$1');
  }
  return axiosConfig;
});  
Sentry.init({
  dsn: "https://7a695925871f4a5b9e54648b971cacec@o1383934.ingest.sentry.io/6701744",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
firebaseInit();
const container = document.getElementById('root');
const root = createRoot(container);
// const Compo = () => {
//   useEffect(() => {
//     console.log('compo mount');
//   }, []);
//   return null;
// };
root.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <React.Fragment>
    <Provider store={store}>
      <MantineProvider
        theme={{
          // Override any other properties from default theme
          fontFamily: 'Lexend',
        }}
      >
        <NotificationsProvider autoClose={5000}>
        <BrowserRouter>
          <RouteHandler />
        </BrowserRouter>
        </NotificationsProvider>
      </MantineProvider>
    </Provider>
  </React.Fragment>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
