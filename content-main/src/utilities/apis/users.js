import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const usersLogin = ({
  accessToken,
}) => axios.post(`${constants.utilityHost}/users/login`, {
  accessToken,
}, {
  headers: headersProvider(),
  noTrailingSlash: true,
});

export const userDetails = () => axios.get(`${constants.utilityHost}/users/details/`, {
  headers: headersProvider(),
});

export const workspaceUsers = () => axios.get(`${constants.utilityHost}/users/workspace-users-list/`, {
  headers: headersProvider(),
});

export const getSelfNotifications = ({
  take, page,
  sortByOptions,
  filterOptions,
}) => axios.post(`${constants.utilityHost}/notifications/self`, {
  page,
  take,
  sortByOptions,
  filterOptions,
},
{
  headers: headersProvider(),
});
