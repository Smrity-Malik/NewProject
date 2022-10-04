import { combineReducers } from 'redux';
import userData from './userData';
import workspaceSettings from './workspaceSettings';
import workspaceUsers from './workspaceUsers';
import notification from './notification';
import allNotification from './allNotification';

const rootReducer = combineReducers({
  userData,
  workspaceSettings,
  workspaceUsers,
  allNotification,
  notification,
});

export default rootReducer;
