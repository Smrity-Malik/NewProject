import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal, SegmentedControl, Text, Textarea, TextInput,
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
import { createFinancialEntryApi } from '../utilities/apis/financials';
import DocumentUploader from '../pages/DocumentUploader/DocumentUploader';
import TextWithLabel from './TextWithLabel';
import UserSelector from './UserSelector/UserSelector';

const FinancialModal = ({
  toLoad,
  refreshParent,
  parentResource,
  parentResourceId,
  componentToShow,
  initialUiState,
  mode,
  initialEntryState,
}) => {
  const [uiConfigs, setUiConfigs] = useState({
    mode,
    modalOpened: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    ...(initialUiState || {}),
  });
  const [errors, setErrors] = useState({});
  const viewMode = uiConfigs.mode === 'view';
  const [entry, setEntry] = useState({
    type: 'Expense',
    amount: 0,
    paidToEmail: '',
    ...(initialEntryState || {}),
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
        setEntry({
          type: 'Expense',
          ...(initialEntryState || {}),
        });
      }
      refreshParent();
    }
  };
  useEffect(() => {
    if (toLoad) {
      setEntry({
        ...toLoad,
        date: toLoad.date ? parseISO(toLoad.date) : null,
        files: (toLoad.files || []).map(cleanFileObj),
      });
      setFiles(toLoad.files.map(getUploadedFileFromObj));
    }
  }, []);

  // const { files } = entry;
  // const setFiles = (incomingFiles) => setEntry({
  //   ...entry,
  //   files: incomingFiles,
  // });
  // const { assigneeFiles } = entry;
  // const setAssigneeFiles = (incomingFiles) => setEntry({
  //   ...entry,
  //   assigneeFiles: incomingFiles,
  // });
  //
  const directChange = (name) => (value) => {
    setEntry({
      ...entry,
      [name]: value,
    });
  };

  const changeHandler = (name) => (event) => {
    if (typeof event.getMonth === 'function') {
      setEntry({
        ...entry,
        [name]: event,
      });
      return;
    }
    setEntry({
      ...entry,
      [name]: event.target.value,
    });
  };

  const changeHandlerWithValue = (name) => ({
    onChange: changeHandler(name),
    value: entry[name],
  });

  const validate = () => {
    const keys = {};
    if (Number.isNaN(entry.amount) || entry.amount < 1) {
      keys.amount = 'Please check value';
    }
    if (!entry.purpose || !entry.purpose.length) {
      keys.purpose = 'Please check value';
    }
    if (!entry.date?.getTime) {
      keys.date = 'Please check value';
    }
    if (Object.keys(keys).length) {
      setErrors(keys);
      return false;
    }
    setErrors({});
    return true;
  };

  const createFinancialEntry = async () => {
    if (!validate()) {
      return;
    }
    if (parentResource && parentResourceId) {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.LOADING,
      });
      const entryData = {
        ...entry,
        parentResource,
        parentResourceId,
        date: formatISO(entry.date),
        files: files.map(cleanFileObj),
      };
      const response = await apiWrapWithErrorWithData(createFinancialEntryApi({
        entryData,
      }));
      if (response?.success) {
        toggle();
        showNotification({
          color: 'green',
          title: 'Entry Created',
          message: 'Entry has been created.',
        });
      } else {
        showNotification({
          color: 'red',
          title: 'Financial Entry',
          message: 'Entry could not be saved. Something went wrong.',
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
      title="Financial Entry"
    >
      <div className="flex flex-row justify-between">
        <div className="w-1/2">
          <div className="my-2">
            {parentResourceId && (
            <Text color="gray">
              Financial Entry for
              {' '}
              {' '}
              {parentResourceId}
            </Text>
            )}
            <div className="m-4 flex flex-col">
              <SegmentedControl
                disabled={viewMode}
                color="blue"
                className="my-2"
                value={entry.type}
                onChange={directChange('type')}
                data={[{
                  label: 'Expense', value: 'Expense',
                }, {
                  label: 'Recovery', value: 'Recovery',
                }]}
              />
              {viewMode
                ? <TextWithLabel text={entry.amount} label="Amount" />
                : (
                  <TextInput
                    onChange={changeHandler('amount')}
                    label="Amount"
                    placeholder="Enter Amount"
                    value={entry.amount}
                    className="my-2"
                    error={errors.amount}
                  />
                )}
              {viewMode
                ? <TextWithLabel label="Paid to" text={entry.paidToEmail} />
                : (
                  <UserSelector
                    placeholder="Enter user paid to"
                    label="Select user paid to"
                    {...changeHandlerWithValue('paidToEmail')}
                  />
                ) }
              {viewMode
                ? <TextWithLabel label="Purpose" text={entry.purpose} />
                : (
                  <TextInput
                    onChange={changeHandler('purpose')}
                    label="Purpose"
                    placeholder="Enter Purpose"
                    value={entry.purpose}
                    className="my-2"
                    error={errors.purpose}
                  />
                ) }
              {viewMode
                ? (
                  <Textarea
                    readOnly
                    className="my-2"
                    placeholder="Enter description"
                    label="Description"
                    value={entry.description}
                    {...changeHandlerWithValue('description')}
                  />
                )
                : (
                  <Textarea
                    className="my-2"
                    placeholder="Enter description"
                    label="Description"
                    value={entry.description}
                    {...changeHandlerWithValue('description')}
                  />
                )}

              {viewMode
                ? <TextWithLabel label="Date" text={formatDate(entry.date)} />
                : (
                  <DatePicker
                    className="my-2"
                    placeholder="Pick date"
                    label="Date"
                    {...changeHandlerWithValue('date')}
                    error={errors.date}
                  />
                ) }
              <div className="flex flex-col w-full">
                <Text className="my-2">Document(s)</Text>
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
                        <Button onClick={createFinancialEntry}>
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

export default FinancialModal;
