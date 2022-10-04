import { showNotification } from '@mantine/notifications';
import store from '../redux/store';
import { apiWrapWithErrorWithData } from './apiHelpers';
import { getSettings, saveSettings } from './apis/settings';
import actions from '../redux/actions';

export const postFromStoreToServer = async () => {
  const { workspaceSettings } = store.getState();
  const response = await apiWrapWithErrorWithData(saveSettings({
    settingsData: workspaceSettings,
  }));
  if (!response || !response?.success) {
    showNotification({
      color: 'red',
      title: 'Settings',
      message: "Couldn't save settings data.",
    });
  }
};

export const pullIntoStoreFromServer = async () => {
  const response = await apiWrapWithErrorWithData(getSettings());
  if (!response || !response?.success) {
    showNotification({
      color: 'red',
      title: 'Settings',
      message: "Couldn't get settings data.",
    });
    return;
  }
  if (response?.success && response?.settings) {
    store.dispatch({
      type: actions.SET_WORKSPACE_SETTINGS,
      payload: response.settings,
    });
  }
};
