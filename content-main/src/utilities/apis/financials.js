import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const getResourceFinances = ({
  parentResource,
  parentResourceId,
  page,
}) => axios.get(`${constants.utilityHost}/expenses/list`, {
  params: {
    parent: parentResource,
    parentId: parentResourceId,
    page,
  },
  headers: headersProvider(),
});

export const createFinancialEntryApi = ({
  expenseData,
}) => axios.post(`${constants.utilityHost}/expenses/create-expense`, {
  ...expenseData,
}, {
  headers: headersProvider(),
});

export const getExpenseDetails = ({
  expenseId,
}) => axios.get(`${constants.utilityHost}/expenses/details/${expenseId}`, {
  headers: headersProvider(),
});
