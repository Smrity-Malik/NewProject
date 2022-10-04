import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const createCase = ({
  caseData,
}) => axios.post(`${constants.utilityHost}/cases/create-case`, {
  caseData,
},
{
  headers: headersProvider(),
});

export const getCasesList = ({
  page,
  sortByOptions,
  filterOptions,
}) => axios.post(`${constants.utilityHost}/cases/list`, {
  page,
  sortByOptions,
  filterOptions,
}, {
  headers: headersProvider(),
});

export const updateCase = ({
  caseId, caseData, amount, status,
}) => axios.put(`${constants.utilityHost}/cases/edit-case/${caseId}`, {
  caseData,
  amount,
  status,
}, {
  headers: headersProvider(),
});

export const getCaseDetails = ({
  caseId,
}) => axios.get(`${constants.utilityHost}/cases/details/${caseId}`, {
  headers: headersProvider(),
});

export const getCaseRecordDetails = ({
  caseRecordId,
}) => axios.get(`${constants.utilityHost}/cases/records/details/${caseRecordId}`, {
  headers: headersProvider(),
});

export const createCaseRecord = ({ caseRecordData }) => axios.post(`${constants.utilityHost}/cases/records/create-case-record`, {
  ...caseRecordData,
}, {
  headers: headersProvider(),
});

export const listCaseRecords = ({ caseId, page }) => axios.get(`${constants.utilityHost}/cases/records/list`, {
  params: {
    caseId,
    page,
  },
  headers: headersProvider(),
});

export const casesAnalytics = () => axios.get(`${constants.utilityHost}/cases/analytics`, {
  headers: headersProvider(),
});
