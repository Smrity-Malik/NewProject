import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const requestDemo = (data) => axios.post(`${constants.apiHost}/demo-request`, data, {
  headers: headersProvider(),
});
