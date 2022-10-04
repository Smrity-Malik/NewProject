import axios from 'axios';
import { getDatabase, ref, set } from 'firebase/database';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const saveSettings = ({
  settingsData,
}) => axios.put(`${constants.apiHost}/users/workspace-settings`, {
  settingsData,
},
{
  headers: headersProvider(),
});

export const getSettings = () => axios.get(`${constants.apiHost}/users/get-workspace-settings`, {
  headers: headersProvider(),
});

export const putSettingsInFirebaseDb = ({ settingsData }) => {
  const db = getDatabase();
  const nodeRef = ref(db, `${constants.env}/workspace-settings/${constants.workspaceId}`);
  return set(nodeRef, settingsData);
};
