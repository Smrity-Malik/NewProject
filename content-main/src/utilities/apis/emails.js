import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const sendEmail = ({
  data,
}) => axios.post(`${constants.utilityHost}/emails/new/outgoing`, {
  ...data,
}, {
  headers: headersProvider(),
});

export const getEmailsApi = ({
  page,
  parent,
  parentId,
}) => axios.get(`${constants.utilityHost}/emails/threads`, {
  params: {
    page,
    parent,
    parentId,
  },
  headers: headersProvider(),
});

export const getEmailsFromThreadApi = ({
  threadId,
  page,
}) => axios.get(`${constants.utilityHost}/emails/threads/${threadId}/emails`, {
  params: {
    page,
  },
  headers: headersProvider(),
});
