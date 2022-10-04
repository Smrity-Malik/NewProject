/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal, Text, Textarea, TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { formatISO, parseISO } from 'date-fns';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import {
  cleanFileObj, formatDate, getUploadedFileFromObj, loadingStates,
} from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import colors from '../utilities/design';
import DocumentUploader from '../pages/DocumentUploader/DocumentUploader';
import TextWithLabel from './TextWithLabel';
import { createCaseRecord } from '../utilities/apis/cases';

const CaseRecordModal = ({
  toLoad,
  refreshParent,
  parentResource,
  parentResourceId,
  componentToShow,
  initialUiState,
  mode,
  initialEntryState: initialRecordState,
}) => {
  const [uiConfigs, setUiConfigs] = useState({
    mode,
    modalOpened: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    ...(initialUiState || {}),
  });
  const viewMode = uiConfigs.mode === 'view';
  const [record, setRecord] = useState({
    ...(initialRecordState || {}),
  });
  const [files, setFiles] = useState([]);
  const toggle = (e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }
    setUiConfigs({
      ...uiConfigs,
      modalOpened: !uiConfigs.modalOpened,
    });
    if (uiConfigs.modalOpened && refreshParent) {
      if (!viewMode) {
        setRecord({
          ...(initialRecordState || {}),
        });
      }
      refreshParent();
    }
  };
  useEffect(() => {
    if (toLoad) {
      setRecord({
        ...toLoad,
        date: toLoad.date ? parseISO(toLoad.date) : null,
        files: (toLoad.files || []).map(cleanFileObj),
      });
      setFiles(toLoad.files.map(getUploadedFileFromObj));
    }
  }, []);

  // const { files } = record;
  // const setFiles = (incomingFiles) => setEntry({
  //   ...record,
  //   files: incomingFiles,
  // });
  // const { assigneeFiles } = record;
  // const setAssigneeFiles = (incomingFiles) => setEntry({
  //   ...record,
  //   assigneeFiles: incomingFiles,
  // });
  //
  // const directChange = (name) => (value) => {
  //   setRecord({
  //     ...record,
  //     [name]: value,
  //   });
  // };

  const changeHandler = (name) => (event) => {
    if (typeof event.getMonth === 'function') {
      setRecord({
        ...record,
        [name]: event,
      });
      return;
    }
    setRecord({
      ...record,
      [name]: event.target.value,
    });
  };

  const changeHandlerWithValue = (name) => ({
    onChange: changeHandler(name),
    value: record[name],
  });

  const createCaseRecordEntry = async () => {
    if (parentResource && parentResourceId) {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.LOADING,
      });
      const recordData = {
        ...record,
        parentResource,
        parentResourceId,
        nextHearingDate: formatISO(record.nextHearingDate),
        caseHearingDate: formatISO(record.caseHearingDate),
        files: files.map(cleanFileObj),
      };
      const response = await apiWrapWithErrorWithData(createCaseRecord({
        caseId: parentResourceId,
        recordData,
      }));
      if (response?.success) {
        toggle();
        showNotification({
          color: 'green',
          title: 'Record Created',
          message: 'Record has been created.',
        });
      } else {
        setUiConfigs({
          ...uiConfigs,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        });
        showNotification({
          color: 'red',
          title: 'Failed to save.',
        });
      }
    } else {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
      showNotification({
        color: 'red',
        title: 'Resource Missing',
      });
    }
  };

  if (!uiConfigs.modalOpened) {
    return <div onClick={toggle}>{componentToShow}</div>;
  }

  return (
    <Modal
      overflow="inside"
      closeOnClickOutside={false}
      size="calc(50vw)"
      opened={uiConfigs.modalOpened}
      onClose={toggle}
      title="Case Record"
    >
      <div className="flex flex-row justify-between">
        <div className="w-1/2">
          <div className="my-2">
            {parentResourceId && (
              <Text color="gray">
                Case Record for
                {' '}
                {' '}
                {parentResourceId}
              </Text>
            )}
            <div className="m-4 flex flex-col">
              {viewMode
                ? <TextWithLabel label="Case Hearing" text={formatDate(record.caseHearingDate)} />
                : (
                  <DatePicker
                    className="my-2"
                    placeholder="Pick date"
                    label="Case Hearing Date"
                    {...changeHandlerWithValue('caseHearingDate')}
                  />
                ) }
              {viewMode
                ? <TextWithLabel label="Next Hearing" text={formatDate(record.nextHearingDate)} />
                : (
                  <DatePicker
                    className="my-2"
                    placeholder="Pick date"
                    label="Next Hearing"
                    {...changeHandlerWithValue('nextHearingDate')}
                  />
                ) }
              {viewMode
                ? <TextWithLabel label="Purpose" text={record.purpose} />
                : (
                  <TextInput
                    onChange={changeHandler('purpose')}
                    placeholder="Enter Purpose"
                    label="Purpose"
                    value={record.purpose}
                    className="my-2"
                  />
                ) }
              {viewMode
                ? <TextWithLabel label="Fixed for" text={record.fixedFor} />
                : (
                  <TextInput
                    onChange={changeHandler('fixedFor')}
                    placeholder="Fixed for"
                    label="Fixed for"
                    value={record.fixedFor}
                    className="my-2"
                  />
                ) }
              {viewMode
                ? (
                  <Textarea
                    readOnly
                    className="my-2"
                    placeholder="Enter Summary"
                    label="Summary"
                    value={record.summary}
                    {...changeHandlerWithValue('summary')}
                  />
                )
                : (
                  <Textarea
                    className="my-2"
                    placeholder="Enter Summary"
                    label="Summary"
                    value={record.summary}
                    {...changeHandlerWithValue('summary')}
                  />
                )}
              <div className="flex flex-col">
                <Text className="my-2">Order/Documents(s)</Text>
                <DocumentUploader
                  parentResource={parentResource}
                  parentResourceId={parentResourceId}
                  hideDropZone={viewMode}
                  files={files}
                  setFiles={setFiles}
                />
              </div>
              {!viewMode
                  && (
                  <div>
                    {uiConfigs.loading === loadingStates.LOADING
                      ? <BeatLoader size={10} color={colors.primary} />
                      : (
                        <Button onClick={createCaseRecordEntry}>
                          Create
                        </Button>
                      )}
                  </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CaseRecordModal;
