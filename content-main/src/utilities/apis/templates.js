import axios from 'axios';
import constants from '../constants';
import { headersProvider } from '../apiHelpers';

export const addTemplate = ({
  type,
  name,
  category,
  html,
}) => axios.post(`${constants.utilityHost}/templates/create`, {
  type,
  name,
  category,
  html,
}, {
  headers: headersProvider(),
});

export const templatesListApi = ({
  page,
  type,
  category,
}) => axios.get(`${constants.utilityHost}/templates/list`, {
  params: {
    page,
    type,
    category,
  },
  headers: headersProvider(),
});

export const templatesDetailsApi = ({
  templateId,
}) => axios.get(`${constants.utilityHost}/templates/details/${templateId}`, {
  headers: headersProvider(),
});
