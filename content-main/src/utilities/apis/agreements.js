import axios from 'axios';
import { apiWrapWithErrorWithData, headersProvider } from '../apiHelpers';
import constants from '../constants';

export const createAgreement = ({
  agreementData, ...restArgs
}) => axios.post(`${constants.utilityHost}/agreements/new-agreement`, {
  agreementData, ...restArgs,
},
{
  headers: headersProvider(),
});

export const getAgreementsList = ({
  page, sortByOptions, filterOptions,
}) => axios.post(`${constants.utilityHost}/agreements/list`, {
  page,
  filterOptions,
  sortByOptions,
}, {
  headers: headersProvider(),
});

export const updateAgreement = ({
  agreementId, agreementData, ...restArgs
}) => axios.put(`${constants.utilityHost}/agreements/update/${agreementId}`, {
  agreementData, ...restArgs,
}, {
  headers: headersProvider(),
});

export const getAgreementDetails = ({
  agreementId,
}) => axios.get(`${constants.utilityHost}/agreements/details/${agreementId}`, {
  headers: headersProvider(),
});

export const createSigningRequest = (emails) => axios.post('https://w6bduqd0tj.execute-api.us-east-1.amazonaws.com/default/signer-proxy', {
  emails,
}, {
  noTrailingSlash: true,
});

const b64toUrl = async (base64Data) => {
  const r = await fetch(base64Data);
  const blob = await r.blob();
  return URL.createObjectURL(blob);
};

export const getPreviewUrl = async (delta) => {
  let url = null;
  const data = await apiWrapWithErrorWithData(axios.post(`${constants.utilityHost}/utilities/common/get-pdf-in-base64`, {
    quillDelta: delta,
  }));
  if (data.success && data.fileString) {
    url = await b64toUrl(data.fileString);
  }
  return { url, base64File: data?.fileString };
};

export const getAgreementSignStatusApi = ({ agreementId }) => axios.get(`${constants.utilityHost}/agreements/sign-details/${agreementId}`, {
  headers: headersProvider(),
});

export const sendAgreementForSignature = ({ signers, agreementId, ...params }) => axios.post(`${constants.utilityHost}/agreements/sign-initiate/${agreementId}`, {
  ...params,
  signers,
}, {
  headers: headersProvider(),
});

export const cancelAgreementSignature = ({ agreementId }) => axios.post(`${constants.utilityHost}/agreements/sign-cancel/${agreementId}`, {}, {
  headers: headersProvider(),
});

export const agreementAnalytics = () => axios.get(`${constants.utilityHost}/agreements/analytics`, {
  headers: headersProvider(),
});

export const getAgreementTypesApi = () => axios.get(`${constants.utilityHost}/agreements/get-distinct-types`, {
  headers: headersProvider(),
});
