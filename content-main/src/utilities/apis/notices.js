import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const submitNoticeRequest = ({
  files, remarks, email,
}) => axios.post(`${constants.utilityHost}/notice-requests/create`, {
  email,
  files,
  remarks,
},
{
  headers: headersProvider(),
});

export const listNoticeRequests = ({
  status, page,
}) => axios.get(`${constants.utilityHost}/notice-requests/list`, {
  params: {
    status,
    page,
  },
  headers: headersProvider(),
});

export const fetchNoticeRequest = ({
  noticeRequestRef,
}) => axios.get(`${constants.utilityHost}/notice-requests/details/${noticeRequestRef}`, {
  headers: headersProvider(),
});

export const updateNoticeRequest = ({
  noticeRequestRef,
  data,
}) => axios.post(`${constants.utilityHost}/notice-requests/update/${noticeRequestRef}`, {
  ...data,
}, {
  headers: headersProvider(),
});

export const buildNewNotice = ({
  noticeData,
  noticeRequestId,
}) => axios.post(`${constants.utilityHost}/notices/create`, {
  noticeData,
  noticeRequestId,
}, {
  headers: headersProvider(),
});

export const updateNotice = ({
  noticeData,
  noticeId,
}) => axios.post(`${constants.utilityHost}/notices/update/${noticeId}`, {
  noticeData,
}, {
  headers: headersProvider(),
});

export const listNotices = ({
  status, page, sortByOptions,
  filterOptions,
}) => axios.post(`${constants.utilityHost}/notices/list`, {
  status,
  page,
  sortByOptions,
  filterOptions,
},
{
  headers: headersProvider(),
});

export const fetchNoticeDetails = ({
  noticeId,
}) => axios.get(`${constants.utilityHost}/notices/details/${noticeId}`, {
  headers: headersProvider(),
});

export const noticesAnalytics = () => axios.get(`${constants.utilityHost}/notices/analytics`, {
  headers: headersProvider(),
});
