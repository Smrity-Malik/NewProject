import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducers';
// import { getUserDataFromCookies } from '../utilities/utilities';

const initialStore = {
  // userData: getUserDataFromCookies(),
  userData: null,
  notification: null,
  allNotification: null,
  workspaceSettings: {
    addresses: [],
    // 'noticeForm.purpose.MoneyRecovery.additionalOptions': [],
    // 'noticeForm.purpose.Others.additionalOptions': [],
  },
};

const store = createStore(rootReducer, initialStore, devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
));

export default store;
