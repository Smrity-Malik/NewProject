import React, { useEffect, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import {
  Anchor, CloseButton, Progress, Text,
} from '@mantine/core';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { cleanFileObj, loadingStates } from '../../utilities/utilities';
import { getPreSignedUrl } from '../../utilities/apis/commonApis';
import DocumentViewer from '../../components/DocumentViewer';

const DocumentUploader = ({
  files, setFiles, dropZoneConfigs, hideDropZone, title, subTitle,
  parentResource, parentResourceId,
}) => {
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const startUpload = () => {
    files.map(
      // eslint-disable-next-line array-callback-return,no-unused-vars
      (file, index) => {
        if (!file.uploadStarted) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const awsAxios = axios.create({
              transformRequest: (data, headers) => {
                // Remove all shared headers
                // delete headers.common;
                // or just the auth header
                // eslint-disable-next-line no-param-reassign
                delete headers.put['Content-Type'];
                return data;
              },
            });
            const newFilesStarted = [...files];
            newFilesStarted[index].uploadStarted = true;
            setFiles(newFilesStarted);
            // eslint-disable-next-line no-unused-vars
            const response = awsAxios({
              url: file.preSignedUrl,
              method: 'put',
              data: reader.result,
              // headers: { "Content-Type" : file.type },
              // maxContentLength: (100 * 1024 * 1024 * 1024),
              // timeout: (30 * 60 * 1000), // 30mins
              // onUploadProgress: (pevt) => {
              //   console.log('updating percentage');
              //   const newFiles = [...files];
              //   newFiles[index].uploadedPercent = Math.round((pevt.loaded / pevt.total) * 100);
              //   console.log('updating percentage');
              //   setFiles({
              //     ...files,
              //     files: newFiles,
              //   });
              // },
            }).then(() => {
              const newFiles = [...files];
              newFiles[index].uploadedComplete = true;
              setFiles(newFiles);
            }).catch(() => {
              const newFiles = [...files];
              newFiles[index].uploadFailed = true;
              setFiles(newFiles);
            });
          });
          reader.readAsArrayBuffer(file.fileData);
        }
      },
    );
  };
  useEffect(startUpload, [files]);
  const onFilesDrop = async (incomingFiles) => {
    // setFiles([
    //   ...files,
    //   ...incomingFiles,
    // ]);
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = (await Promise.allSettled(
      incomingFiles.map((file) => (getPreSignedUrl({ filename: file.name }))),
    ));
    const filesWithPreUrls = incomingFiles.map(
      (file, index) => (
        response[index].status === 'fulfilled' ? ({
          filename: file.name,
          preSignedUrl: response[index].value.data.presignedUrl,
          destination: response[index].value.data.destination,
          uploadedComplete: false,
          uploadStarted: false,
          uploadedPercent: 0,
          uploadFailed: false,
          fileData: file,
        }) : {
          filename: file.name,
          preSignedUrl: null,
          destination: null,
          uploadedComplete: false,
          uploadStarted: true,
          uploadedPercent: 0,
          uploadFailed: true,
          fileData: file,
        }),
    );
    setFiles([...files, ...filesWithPreUrls]);
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
    // startUpload();
  };
  const removeFile = (index) => {
    const newFiles = files.filter((v, i) => i !== index);
    setFiles(newFiles);
  };

  const dropChildren = () => (
    <div>
      <Text size="xl" inline>
        {title || 'Drag files here or click to select files'}
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        {subTitle || 'Attach as many files as you like, each file should not exceed 5mb'}
      </Text>
    </div>
  );
  return (
    <>
      {!hideDropZone
            && (
            <Dropzone
              onDrop={onFilesDrop}
              onReject={(filesIncoming) => showNotification({
                color: 'red',
                title: 'Documents rejected',
                message: `${filesIncoming.length} documents rejected.`,
              })}
              maxSize={1024 * 1024 * 5}
              {...dropZoneConfigs}
            >
              {() => dropChildren()}
            </Dropzone>
            )}
      <div className="my-2">
        {uiConfigs.loading === loadingStates.LOADING && <BeatLoader size={10} />}
      </div>
      {files && files.length > 0
      && (
      <div className="my-2">
        <span>Selected Files</span>
        {files.map(
          (file, index) => (
            <div key={file.destination} className="my-4">
              <div className="flex flex-row justify-between">
                <Text size="sm">{file.fileData?.name || cleanFileObj(file).fileName}</Text>
                {file.uploadFailed && (
                <div className="flex flex-row">
                  <div className="text-red-800 mr-4">Upload Failed</div>
                  <CloseButton onClick={() => removeFile(index)} aria-label="Close modal" />
                </div>
                ) }
                <div className="flex flex-row">
                  {(file.destination
                      && file.uploadedComplete
                      && parentResource && parentResourceId) && (
                      <DocumentViewer
                        componentToRender={
                          <Anchor>View</Anchor>
                }
                        parentResource={parentResource}
                        parentResourceId={parentResourceId}
                        fileUrl={file.destination}
                      />
                  )}
                  {file.destination
                        && (!hideDropZone
                            && (
                            <CloseButton
                              className="mx-2"
                              onClick={() => removeFile(index)}
                              aria-label="Close modal"
                            />
                            ))}
                </div>
              </div>
              {!file.uploadFailed
                ? (
                  <Progress
                    value={100}
                    color={file.uploadedComplete ? 'green' : 'blue'}
                    animate={!file.uploadedComplete}
                  />
                )
                : (
                  <Progress
                    value={100}
                    color="red"
                  />
                )}
            </div>
          ),
        )}
      </div>
      )}
    </>
  );
};

export default DocumentUploader;
