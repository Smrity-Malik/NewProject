import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const financialAnalyticsApi = () => axios.get(`${constants.utilityHost}/financials/analytics`, {
  headers: headersProvider(),
});

export const financialListApi = ({
  module,
}) => axios.get(`${constants.utilityHost}/financials/list?module=${module}`, {
  headers: headersProvider(),
});

export const topServiceProvidersApi = () => axios.get(`${constants.utilityHost}/financials/top-service-providers`, {
  headers: headersProvider(),
});

export const expenseMonthlyApi = () => axios.get(`${constants.utilityHost}/financials/month-expense`, {
  headers: headersProvider(),
});
