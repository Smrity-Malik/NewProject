import React, { useState } from 'react';
import {
  Button,
  Modal, MultiSelect, Text, TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { loadingStates, validateEmail } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { sendEmail } from '../utilities/apis/emails';
import colors from '../utilities/design';
import Editor from './Editor';
import useMultiFileUpload from '../hooks/useMultiFileUpload';
import NewDocumentUploader from './NewDocumentUploader/NewDocumentUploader';

const EmailBox = ({
  initialData, onClose, parentResource, parentResourceId,
}) => {
  const initialConfigs = {
    readOnly: initialData.readOnly,
    direction: initialData.direction,
    from: initialData.from || [],
    to: initialData.to || null,
    cc: initialData.cc || null,
    bcc: initialData.bcc || [],
    body: initialData.body || '<p>Email Body</p>',
    subject: initialData.subject || '',
    documents: initialData.documents || [],
  };
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    data: {
      ...initialConfigs,
      toMultiSelectData: [],
      ccMultiSelectData: [],
      bccMultiSelectData: [],
      quillHtml: '',
    },
  });

  const multiUploadArgs = useMultiFileUpload({
    parent: parentResource,
    parentId: parentResourceId,
    loadFromParent: true,
    attachToParent: false,
  });

  const checkedFiles = multiUploadArgs.finalFiles.filter((file) => !!file.checked);

  const emailsChangeHandler = (target) => (val) => {
    setConfigs((stateC) => ({
      ...stateC,
      data: {
        ...stateC.data,
        [target]: val.filter(validateEmail),
      },
    }));
  };
  const emailCreateLabelHandler = (query) => (
    <Text color={validateEmail(query) ? 'green' : 'red'}>
      +Add
      {` ${query}`}
    </Text>
  );
  const emailSendHandler = async () => {
    const invalidToEmails = (configs.data.to.filter((email) => !validateEmail(email))).length;
    const invalidCcEmails = (
      (configs.data.cc || [])
        .filter((email) => !validateEmail(email))).length;
    const invalidBccEmails = (configs.data.bcc.filter((email) => !validateEmail(email))).length;
    const subjectBodyLen = configs.data.subject?.length;
    const bodyLen = configs.data.body?.length;
    if (!configs.data.to.length
        || invalidToEmails
        || invalidCcEmails
        || invalidBccEmails
        || !subjectBodyLen
    || !bodyLen) {
      showNotification({
        title: 'Email Form',
        message: 'Please check all inputs.',
        color: 'red',
      });
      return;
    }
    const data = {
      parent: parentResource,
      parentId: parentResourceId,
      to: configs.data.to,
      cc: configs.data.cc,
      bcc: configs.data.bcc,
      subject: configs.data.subject,
      body: configs.data.quillHtml,
      attachments: checkedFiles || [],
    };
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(sendEmail({ data }));
    if (response?.success) {
      showNotification({
        color: 'green',
        title: 'Email',
        message: 'Email sent.',
      });
      onClose();
    } else {
      showNotification({
        color: 'red',
        title: 'Email',
        message: "Email couldn't be send.",
      });
    }
    setConfigs({
      ...configs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };

  const multiSelCreate = (stateName) => (query) => {
    if (!validateEmail(query)) {
      return;
    }
    const item = ({
      value: query,
      label: query,
    });
    setConfigs((stateC) => ({
      ...stateC,
      data: {
        ...stateC.data,
        [stateName]: [...stateC.data[stateName], item],
      },
    }));
    // eslint-disable-next-line consistent-return
    return item;
  };

  return (
    <Modal
      overflow="inside"
      size="calc(60vw)"
      opened
      onClose={onClose}
      title="Email"
    >
      <div className="flex flex-col px-4">
        <MultiSelect
          label="To"
          data={configs.data.toMultiSelectData}
          value={configs.data.to}
          onChange={emailsChangeHandler('to')}
          placeholder="Type email and press Enter"
          creatable
          searchable
          getCreateLabel={emailCreateLabelHandler}
          onCreate={multiSelCreate('toMultiSelectData')}
        />
        {configs.data.direction === 'incoming'
              && (
              <MultiSelect
                label="From"
                data={[]}
                value={configs.data.from}
                onChange={emailsChangeHandler('from')}
                placeholder="Type email and press Enter"
                creatable
                searchable
                getCreateLabel={emailCreateLabelHandler}
                onCreate={() => {}}
              />
              )}
        <MultiSelect
          label="CC"
          data={configs.data.ccMultiSelectData}
          value={configs.data.cc}
          onChange={emailsChangeHandler('cc')}
          placeholder="Type email and press Enter"
          creatable
          searchable
          getCreateLabel={emailCreateLabelHandler}
          onCreate={multiSelCreate('ccMultiSelectData')}
        />
        {/* <MultiSelect */}
        {/*  label="BCC" */}
        {/*  data={configs.data.bccMultiSelectData} */}
        {/*  value={configs.data.bcc} */}
        {/*  onChange={emailsChangeHandler('bcc')} */}
        {/*  placeholder="Type email and press Enter" */}
        {/*  creatable */}
        {/*  searchable */}
        {/*  getCreateLabel={emailCreateLabelHandler} */}
        {/*  onCreate={multiSelCreate('bccMultiSelectData')} */}
        {/* /> */}
        <TextInput
          label="Subject"
          placeholder="Type a meaningful subject line"
          value={configs.data.subject}
          onChange={(e) => {
            setConfigs({
              ...configs,
              data: {
                ...configs.data,
                subject: e.target.value,
              },
            });
          }}
        />
        <Text className="my-2">Body</Text>
        <Editor
          content={configs.data.body}
          onHtmlChange={(html) => setConfigs((stateC) => ({
            ...stateC,
            data: {
              ...stateC.data,
              quillHtml: html,
            },
          }))}
          onContentChange={
                  (html) => {
                    setConfigs((stateC) => ({
                      ...stateC,
                      data: {
                        ...stateC.data,
                        body: html,
                      },
                    }));
                  }
                }
        />
        <div className="flex flex-col my-4 px-4">
          <Text>
            Attachments:
            {' '}
            {checkedFiles.length}
            {' '}
            Files
          </Text>
          <Text color="gray">Tick/Attach files you want to send with email.</Text>
          <NewDocumentUploader
            hideDeleteButton
            checkBoxShow
            multiUploadArgs={multiUploadArgs}
          />
        </div>

        {configs.loading === loadingStates.LOADING ? <BeatLoader color={colors.primary} size={10} />
          : <Button className="my-2 w-24" onClick={emailSendHandler}>Send</Button>}
      </div>
    </Modal>
  );
};

export default EmailBox;
