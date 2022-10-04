import { useEffect, useState } from 'react';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import {
  attachFileToParent, deleteFileApi, getParentFiles, getPreSignedUrl, getReadPresignedUrl,
} from '../utilities/apis/commonApis';
import { loadingStates } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';

const useMultiFileUpload = ({
  loadFromParent = true, parent, parentId, existingFiles = [], attachToParent = true,
  onFileCheck,
}) => {
  const commonAttributes = {
    downloading: loadingStates.NO_ACTIVE_REQUEST,
    attaching: loadingStates.NO_ACTIVE_REQUEST,
    attached: false,
  };
  const [uiConfigs, setUiConfigs] = useState({
    loadingFromParent: loadingStates.NO_ACTIVE_REQUEST,
  });
  const [files, setFiles] = useState(existingFiles.map((file) => ({
    fileId: file.id || null,
    url: file.hostedLink,
    uploaded: true,
    uploadStarted: true,
    fileName: file.fileName,
    extension: file.extension,
    fetchingUploadUrl: false,
    mimeType: file.mimeType,
    uploadPercentage: 100,
    errored: false,
    ...commonAttributes,
    attached: file.id !== undefined,
  })));

  const addFiles = async (incomingFiles) => {
    const oldFilesLength = files.length;
    const newFiles = (incomingFiles.map((file) => {
      let ext = file.name.split('.');
      ext = ext[ext.length - 1];
      return ({
        url: null,
        uploaded: false,
        uploadStarted: false,
        fileName: file.name,
        extension: ext,
        mimeType: file.type,
        uploadPercentage: 0,
        fetchingUploadUrl: true,
        fileData: file,
        errored: false,
        ...commonAttributes,
      });
    }));

    const mergedFiles = [...files, ...newFiles];

    setFiles(mergedFiles);

    const response = (await Promise.allSettled(
      newFiles.map((file) => (getPreSignedUrl({
        extension: file.extension,
        contentType: file.mimeType,
      }))),
    ));

    // eslint-disable-next-line no-unused-vars
    const newFileMap = response.map((promise, index) => {
      const mergedIndex = oldFilesLength + index;
      const allFiles = [...mergedFiles];
      if (response[index].status === 'fulfilled') {
        allFiles[mergedIndex].fetchingUploadUrl = false;
        allFiles[mergedIndex].signedUrl = response[index].value.data.signedUrl;
        allFiles[mergedIndex].url = response[index].value.data.destination;
      } else {
        allFiles[mergedIndex].errored = true;
      }
      setFiles(allFiles);
      return allFiles;
    });
  };

  const startUpload = () => {
    // eslint-disable-next-line no-unused-vars
    const uploading = files.map(
      // eslint-disable-next-line array-callback-return
      (file, index) => {
        const isUploadable = (!file.uploaded
            && !file.uploadStarted
            && !file.fetchingUploadUrl
            && !file.errored);
        if (isUploadable) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const awsAxios = axios.create({
              transformRequest: (data, headers) => {
                // Remove all shared headers
                // delete headers.common;
                // or just the auth header
                // eslint-disable-next-line no-param-reassign
                headers.put['Content-Type'] = file.mimeType;
                return data;
              },
            });
            // eslint-disable-next-line no-unused-vars
            const response = awsAxios({
              url: file.signedUrl,
              method: 'put',
              data: reader.result,
              // headers: { 'Content-Type': file.mimeType },
              // maxContentLength: (100 * 1024 * 1024 * 1024),
              // timeout: (30 * 60 * 1000), // 30mins
              onUploadProgress: (pevt) => {
                setFiles((filesInState) => {
                  const newFiles = [...filesInState];
                  const newPercentage = Math.round((pevt.loaded / pevt.total) * 100);
                  if (newPercentage < newFiles[index].uploadPercentage) {
                    return newFiles;
                  }
                  newFiles[index].uploadPercentage = Math.round((pevt.loaded / pevt.total) * 100);
                  newFiles[index].uploadStarted = true;
                  return newFiles;
                });
              },
            }).then(async () => {
              const newFiles = [...files];
              newFiles[index].uploaded = true;
              newFiles[index].fileData = null;
              if (parent && parentId && attachToParent) {
                newFiles[index].attaching = loadingStates.LOADING;
              }
              setFiles(newFiles);
              if (parent && parentId && attachToParent) {
                const resp = await apiWrapWithErrorWithData(
                  attachFileToParent({
                    parentId,
                    parent,
                    fileName: file.fileName,
                    extension: file.extension,
                    mimeType: file.mimeType,
                    hostedLink: file.url,
                  }),
                );
                const newFiles2 = [...newFiles];

                if (resp?.success && resp?.file?.id) {
                  newFiles2[index].attaching = loadingStates.NO_ACTIVE_REQUEST;
                  newFiles2[index].attached = true;
                  newFiles2[index].fileId = resp.file.id;
                } else {
                  newFiles2[index].errored = true;
                  newFiles2[index].uploaded = true;
                  newFiles2[index].attached = false;
                  newFiles2[index].attaching = loadingStates.NO_ACTIVE_REQUEST;
                }
                setFiles(newFiles2);
              }
            }).catch(() => {
              const newFiles = [...files];
              newFiles[index].errored = true;
              newFiles[index].uploaded = false;
              setFiles(newFiles);
            });
          });
          reader.readAsArrayBuffer(file.fileData);
          setFiles((filesInState) => {
            const newFiles = [...filesInState];
            newFiles[index].uploadStarted = true;
            newFiles[index].uploadPercentage = 0;
            return newFiles;
          });
        }
      },
    );
  };

  useEffect(startUpload, [files]);

  const deleteFile = (indexToDelete) => async () => {
    const newFiles = files.filter(
      (file, index) => index !== indexToDelete,
    );
    setFiles(newFiles);
    if (files[indexToDelete].attached && files[indexToDelete].fileId) {
      const resp = await apiWrapWithErrorWithData(
        deleteFileApi(
          { fileId: files[indexToDelete].fileId },
        ),
      );
      if (!resp.success) {
        showNotification({
          title: 'Deletion Failed',
          message: 'File deletion failed.',
          color: 'red',
        });
      }
    }
  };

  const checkFile = (indexToCheck) => () => {
    // const newFiles = files.map(
    //   (file, index) => ({ ...file, checked: index === indexToCheck }),
    // );
    if (onFileCheck && !files[indexToCheck].checked) {
      if (!onFileCheck(files[indexToCheck], files)) {
        setFiles((filesInState) => (filesInState.map(
          (file, index) => ({
            ...file,
            checked: !!filesInState[index].checked,
          }),
        )));
        return;
      }
    }
    setFiles((filesInState) => (filesInState.map(
      (file, index) => ({
        ...file,
        checked: (index === indexToCheck)
          ? !filesInState[index].checked
          : !!filesInState[index].checked,
      }),
    )));
  };

  const finalFiles = (files.filter((file) => (file.uploaded))).map(
    (file) => ({
      fileId: file.fileId || null,
      fileName: file.fileName,
      extension: file.extension,
      mimeType: file.mimeType,
      hostedLink: file.url,
      attached: file.attached,
      checked: file.checked,
    }),
  );

  const downloadFile = (index) => async () => {
    const newFiles = [...files];
    newFiles[index].downloading = loadingStates.LOADING;
    setFiles(newFiles);
    const response = await apiWrapWithErrorWithData(getReadPresignedUrl({
      hostedLink: newFiles[index].url,
      parentId,
      parent,
    }));
    const responseFiles = [...newFiles];
    responseFiles[index].downloading = loadingStates.NO_ACTIVE_REQUEST;
    setFiles(responseFiles);
    if (response?.success && response?.signedUrl) {
      window.open(response.signedUrl, '_blank').focus();
    }
  };

  const addUploadedFiles = (uploadedFiles) => {
    setFiles(
      (stateFiles) => {
        const allFilesUrl = (stateFiles.map((file) => file.url)).filter(
          (url) => !!url,
        );
        const incomingFiles = uploadedFiles.filter(
          (file) => !allFilesUrl.includes(file.hostedLink),
        );
        const newFiles = [...stateFiles, ...incomingFiles.map((file) => ({
          fileId: file.id || null,
          url: file.hostedLink,
          uploaded: true,
          uploadStarted: true,
          fileName: file.fileName,
          extension: file.extension,
          fetchingUploadUrl: false,
          mimeType: file.mimeType,
          uploadPercentage: 100,
          errored: false,
          ...commonAttributes,
          attached: file.id !== undefined,
        }))];

        return newFiles;
      },
    );
  };

  const resetUploadedFiles = () => {
    setFiles([]);
  };

  useEffect(() => {
    (async () => {
      if (loadFromParent && parentId && parent) {
        setUiConfigs({ ...uiConfigs, loadingFromParent: loadingStates.LOADING });
        const resp = await apiWrapWithErrorWithData(getParentFiles({
          parentId,
          parent,
        }));
        if (resp?.success && resp?.files) {
          addUploadedFiles(resp.files);
        }
        setUiConfigs({ ...uiConfigs, loadingFromParent: loadingStates.NO_ACTIVE_REQUEST });
      }
    })();
    return () => {
      setFiles([]);
    };
  }, []);

  const unCheckAllFiles = () => {
    setFiles((prevStateFieles) => (prevStateFieles.map(
      (stFile) => ({
        ...stFile,
        checked: false,
      }),
    )));
  };

  return {
    addFiles,
    addUploadedFiles,
    deleteFile,
    checkFile,
    downloadFile,
    resetUploadedFiles,
    unCheckAllFiles,
    finalFiles,
    files,
    loadingFromParent: uiConfigs.loadingFromParent,
  };
};

export default useMultiFileUpload;
