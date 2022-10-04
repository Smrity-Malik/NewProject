/* eslint-disable max-len */
import {
  Button, Radio, Modal, Text, Anchor,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import styles from './SignatureRequest.module.css';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';

function SignatureRequest({ signers, sendForSignature, agreementId }) {
  const [configs, setConfigs] = useState({
    agreementContent: 'editor',
    selectedFile: null,
  });
  const multiUploadArgs = useMultiFileUpload({
    parent: 'agreement',
    parentId: agreementId,
    loadFromParent: true,
    onFileCheck: (file, files) => {
      const checkedFiles = files.filter((currFile) => currFile.checked);
      if (checkedFiles.length) {
        showNotification({
          title: 'Agreement File',
          message: 'Select only one file.',
          color: 'red',
        });
        return false;
      }
      if (file.extension.toLowerCase() === 'pdf') {
        setConfigs((prevState) => ({
          ...prevState,
          selectedFile: ({
            fileId: file.fileId || null,
            fileName: file.fileName,
            extension: file.extension,
            mimeType: file.mimeType,
            hostedLink: file.url,
          }),
          agreementContent: 'file',
        }));
        return true;
      }
      showNotification({
        title: 'Agreement File',
        message: 'Select a PDF file',
        color: 'red',
      });
      return false;
    },
  });

  useEffect(() => {
    if (configs.agreementContent !== 'file' && configs.selectedFile) {
      setConfigs((prevState) => ({
        ...prevState,
        selectedFile: null,
      }));
      multiUploadArgs.unCheckAllFiles();
    }
  }, [configs.agreementContent]);

  let valid = false;
  if (configs.agreementContent === 'file') {
    valid = !!configs.selectedFile?.fileName;
  }
  if (configs.agreementContent === 'editor') {
    valid = true;
  }

  return (
    <>
      <Modal
        opened={(configs.agreementContent === 'file' && !configs.selectedFile)}
        size="calc(80vw)"
        onClose={() => {
          setConfigs((prevState) => {
            if (!prevState.selectedFile) {
              return ({
                ...prevState,
                agreementContent: null,
              });
            }
            return prevState;
          });
        }}
      >
        <NewDocumentUploader multiUploadArgs={multiUploadArgs} checkBoxShow hideDeleteButton />
      </Modal>
      <div className="flex flex-col pt-12 px-6">
        <div className="flex flex-row justify-between">
          <div>
            <div className={styles.signHeading}>
              Signature request will be sent to following emails
            </div>
            <div>
              <a className={styles.link} href={`mailto:${signers[0].email}`}>{signers[0].email}</a>
              {' '}
              and
              {' '}
              <a className={styles.link} href={`mailto:${signers[1].email}`}>{signers[1].email}</a>
            </div>
          </div>
        </div>
        <Radio.Group
          value={configs.agreementContent}
          onChange={(value) => {
            setConfigs((prevState) => ({
              ...prevState,
              agreementContent: value,
            }));
          }}
        >
          <div className="flex justify-items-start mt-4">Select agreement source:</div>
          <div className="flex w-full grid grid-cols-2 gap-x-4">
            <div
              className={`cursor-pointer p-4 ${configs.agreementContent === 'editor' ? 'border-solid border-green-200 rounded' : ''}`}
              onClick={() => {
                setConfigs((prevState) => ({
                  ...prevState,
                  agreementContent: 'editor',
                }));
              }}
            >
              <div className="flex items-center cursor-pointer">
                <Radio value="editor" label="Content from editor" />
              </div>
            </div>
            <div
              className={`cursor-pointer p-4 ${configs.agreementContent === 'file' ? 'border-solid border-green-200 rounded' : ''}`}
              onClick={() => {
                setConfigs((prevState) => ({
                  ...prevState,
                  agreementContent: 'file',
                }));
              }}
            >
              <div className="flex flex-col">
                <Radio value="file" label="Content from pdf file" />
                {configs.selectedFile
                      && (
                      <div className="my-2 flex items-center">
                        <Text className="font-bold mr-4">{configs.selectedFile.fileName}</Text>
                        <Anchor
                          className="underline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfigs((prevState) => ({
                              ...prevState,
                              selectedFile: null,
                            }));
                            multiUploadArgs.unCheckAllFiles();
                          }}
                        >
                          change
                        </Anchor>
                      </div>
                      )}
              </div>
            </div>

          </div>
        </Radio.Group>
        {/* <div className={`${styles.title} mt-14 px-2`}> */}
        {/*  Agreement content of editor will be sent as pdf file. */}
        {/* </div> */}
        {/* <div className={`${styles.text} mt-3 px-2`}> */}
        {/*  Make sure content in contract tab is final. You can also view it in pdf by clicking */}
        {/*  {' '} */}
        {/*  <i>Open in new tab</i> */}
        {/*  {' '} */}
        {/*  button. */}
        {/*  <br /> */}
        {/*  After you click on */}
        {/*  {' '} */}
        {/*  <i>Send for Signature button</i> */}
        {/*  , */}
        {/*  Content from the contract tab editor will be converted to a pdf file and then will be sent for signature to the parites email mentioned here. */}
        {/* </div> */}
        <div className="grid grid-cols-2 mt-10 px-2">
          <div>
            <div className={styles.emailParty}>First Party</div>
            <a className={styles.link} href={`mailto:${signers[0].email}`}>{signers[0].email}</a>
          </div>
          <div>
            <div className={styles.emailParty}>Second Party</div>
            <a className={styles.link} href={`mailto:${signers[1].email}`}>{signers[1].email}</a>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              sendForSignature({
                agreementContent: configs.agreementContent,
                selectedFile: configs.selectedFile,
              });
            }}
            className="w-80 mt-9"
            disabled={!valid}
            color="blue"
          >
            Send for Signature

          </Button>
        </div>
      </div>
    </>
  );
}

export default SignatureRequest;
