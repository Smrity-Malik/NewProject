import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const getPreSignedUrl = ({
  extension,
  contentType,
}) => axios.post(`${constants.utilityHost}/files/request-upload-url`, {
  extension,
  contentType,
}, {
  headers: headersProvider(),
});

export const getReadPresignedUrl = ({
  parent,
  parentId,
  hostedLink,
}) => axios.get(`${constants.utilityHost}/files/file-read`, {
  params: {
    parent,
    parentId,
    hostedLink,
  },
  headers: headersProvider(),
});

export const attachFileToParent = (
  {
    parent, parentId, fileName, extension, mimeType, hostedLink,
  },
) => axios.post(`${constants.utilityHost}/files/attach-file`, {
  parent, parentId, fileName, extension, mimeType, hostedLink,
}, {
  headers: headersProvider(),
});

export const deleteFileApi = ({
  fileId,
}) => axios.post(`${constants.utilityHost}/files/delete-file`, {
  fileId,
}, {
  headers: headersProvider(),
});

export const getParentFiles = ({
  parent, parentId,
}) => axios.get(`${constants.utilityHost}/files/get-parent-files`, {
  headers: headersProvider(),
  noTrailingSlash: true,
  params: {
    parentId,
    parent,
  },
});
