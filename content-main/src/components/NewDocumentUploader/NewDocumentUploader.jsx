/* eslint-disable react/no-children-prop,no-unused-vars */
import React from 'react';
import { Dropzone } from '@mantine/dropzone';
import {
  Button, Progress, Text, ActionIcon, Checkbox,
} from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import colors from '../../utilities/design';
import { loadingStates } from '../../utilities/utilities';
import styles from './NewDocumentUploader.module.css';

const NewDocumentUploader = ({
  multiUploadArgs, hideDropZone, hideDeleteButton, hideOpenButton, checkBoxShow = false,
}) => {
  const {
    addFiles,
    addUploadedFiles,
    deleteFile,
    checkFile,
    downloadFile,
    finalFiles,
    files,
    loadingFromParent,
  } = multiUploadArgs;
  return (
    <div className="flex flex-col px-2">
      {!hideDropZone
              && (
              <Dropzone
                onDrop={addFiles}
                onReject={(filesIncoming) => showNotification({
                  color: 'red',
                  title: 'Files rejected',
                  message: `${filesIncoming.length} files rejected.`,
                })}
                maxSize={1024 * 1024 * 5}
                  // maxFiles={1}
                children={(
                  <div className={`${styles.dropBox} flex flex-col justify-center mt-1`}>
                    <div><img src="/assets/images/download.svg" alt="downloadlogo" /></div>
                    <div className="mt-3">Drop or select files upto 5MB each</div>
                  </div>
                  )}
              />
              )}
      {/* <div className="flex flex-row mt-11"> */}
      {/*    <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" /> */}
      {/*    <div className="flex flex-col w-2/3 pl-3"> */}
      {/*        <div className="flex flex-row justify-between"> */}
      {/*            <div className={`${styles.agrement}`}>Agreement -02</div> */}
      {/*        </div> */}
      {/*        <div className="mt-3"><Progress color="teal" size="xs" value={40} /></div> */}
      {/*    </div> */}
      {/* </div> */}
      {files.map(
        (file, index) => (
          <div className={`flex flex-row w-full ${index === 0 ? 'mt-4' : 'mt-11'}`}>
            { (checkBoxShow && file.uploaded) && (
              <Checkbox
                color="dark"
                size="lg"
                className="mr-4 cursor-pointer"
                checked={file.checked}
                onChange={checkFile(index)}
              />
            )}
            <img src="/assets/images/downloadFileLogo.svg" alt="file upload" />
            <div className="flex flex-col pl-3 w-full">
              <div className="flex flex-row justify-between">
                <div className={`${styles.agrement}`}>{file.fileName}</div>
              </div>
              <div className="mt-3">
                <Progress
                  color={file.errored ? 'red' : 'teal'}
                  size="sm"
                  animate={file.fetchingUploadUrl || (file.attaching === loadingStates.LOADING)}
                  value={(file.fetchingUploadUrl || file.errored) ? 100 : file.uploadPercentage}
                />
              </div>
            </div>
            <div className="flex items-center">
              {
                      (file.uploaded && !hideOpenButton)
                        ? (
                          <Button
                            onClick={downloadFile(index)}
                            className="mx-3 w-60"
                            color="#46BDE1"
                            disabled={file.downloading === loadingStates.LOADING}
                          // classNames={`${styles.btn} mx-3`}
                            variant="outline"
                          >
                            {file.downloading === loadingStates.LOADING
                              ? <BeatLoader size={10} color={colors.primary} />
                              : <Text>Open</Text>}
                          </Button>
                        ) : null
                  }
              {((file.uploaded || file.errored) && !hideDeleteButton)
                  && (
                  <ActionIcon color="red">
                    <Trash onClick={deleteFile(index)} />
                  </ActionIcon>
                  )}
            </div>

          </div>
        ),
      )}
      {loadingFromParent === loadingStates.LOADING && (
      <div className="flex justify-center w-full my-4">
        {' '}
        <BeatLoader size={10} color={colors.primary} />
        {' '}
      </div>
      ) }
      {(files.length === 0 && loadingFromParent !== loadingStates.LOADING) && <div className="flex justify-center w-full my-4"><Text>No Files</Text></div> }
    </div>
  );
};

export default NewDocumentUploader;
