import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

// export const getUserTasks = () => axios.get(`${constants.apiHost}/tasks/my-tasks`, {
//   headers: headersProvider(),
// });

export const createServiceProvider = ({
  serviceProviderData,
}) => axios.post(`${constants.utilityHost}/service-providers/new`, {
  ...serviceProviderData,
}, {
  headers: headersProvider(),
});

export const listServiceProviders = ({
  page,
  filterOptions = null,
  sortByOptions = null,
}) => axios.post(`${constants.utilityHost}/service-providers/list`, {
  page,
  filterOptions,
  sortByOptions,
}, {
  headers: headersProvider(),
});

export const serviceAnalytics = () => axios.get(`${constants.utilityHost}/service-providers/analytics`, {
  headers: headersProvider(),
});

export const serviceProviderLoginApi = ({ email, password }) => axios.post(`${constants.utilityHost}/users/sp-login`, {
  email,
  password,
}, {
  headers: headersProvider(),
});

export const serviceProviderDetailsApi = ({
  serviceProviderId,
}) => axios.get(`${constants.utilityHost}/service-providers/details/${serviceProviderId}`, {
  headers: headersProvider(),
});

export const serviceProviderExpensesApi = ({
  serviceProviderId,
}) => axios.get(`${constants.utilityHost}/service-providers/expenses/${serviceProviderId}`, {
  headers: headersProvider(),
});

export const setSpStatus = ({
  enabled,
  serviceProviderId,
}) => axios.put(`${constants.utilityHost}/service-providers/set-enabled/${serviceProviderId}`, {
  enabled,
}, {
  headers: headersProvider(),
});
