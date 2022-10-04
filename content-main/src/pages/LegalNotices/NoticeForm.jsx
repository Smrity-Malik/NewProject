/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Accordion,
  ActionIcon,
  Button,
  Code,
  Modal,
  Radio,
  RadioGroup,
  SegmentedControl,
  Select,
  Space,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import flat from 'flat';
import { Trash } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { MIME_TYPES } from '@mantine/dropzone';
import { loadingStates, validateAddress } from '../../utilities/utilities';
import DocumentUploader from '../DocumentUploader/DocumentUploader';
import { formSettings } from '../../utilities/formSettings';
import { selectWorkspaceSettings } from '../../redux/selectors';
import AddressAddModal from '../../components/AddressAddModal';
import AddTextOption from '../../components/AddTextOption';
import actions from '../../redux/actions';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { putSettingsInFirebaseDb, saveSettings } from '../../utilities/apis/settings';
import { buildNewNotice, fetchNoticeDetails, updateNotice } from '../../utilities/apis/notices';
import colors from '../../utilities/design';
import AddressRender from '../../components/AddressRender';

// eslint-disable-next-line no-unused-vars
const NoticeForm = ({ noticeConfigs, onClose, setConfigs }) => {
  const [loading, setLoading] = useState(loadingStates.NO_ACTIVE_REQUEST);
  const [filesState, setFiles] = useState([]);
  const files = filesState.length ? [filesState[filesState.length - 1]] : [];
  const noticeForm = useForm({
    initialValues: flat({
      noticeDirection: 'Outgoing',
      recipient: [{ ...formSettings.senderOrReceiver }],
      sender: [],
      purpose: {
        type: 'Money Recovery',
        MoneyRecovery: {
          subType: 'Ordinary',
        },
        Others: {
          subType: 'Cease & Desist',
        },
      },
      noticePeriod: '7 Days',
      template: '',
      mainNoticeFileDestination: null,
      mainNoticeFileName: null,
    }),
  });

  const workSpaceSettings = useSelector(selectWorkspaceSettings);

  useEffect(() => {
    // console.log({ files });
    // const filesCleaned = ('files', ((files || []).filter(
    //   (file) => !!file.destination,
    // )).map(cleanFileObj));
    // if (filesCleaned.length) {
    //   noticeForm.setValues({
    //     ...noticeForm.values,
    //     mainNoticeFileDestination: filesCleaned[0].destination,
    //     mainNoticeFileName: filesCleaned[0].filename,
    //   });
    // } else {
    //   noticeForm.setValues({
    //     ...noticeForm.values,
    //     mainNoticeFileDestination: null,
    //     mainNoticeFileName: null,
    //   });
    // }
    if (noticeForm?.values?.mainNoticeFileDestination && noticeForm?.values?.mainNoticeFileName) {
      setFiles([
        {
          filename: noticeForm.values.mainNoticeFileName,
          destination: noticeForm.values.mainNoticeFileDestination,
          uploadStarted: true,
          uploadedComplete: true,
        },
      ]);
    } else {
      setFiles([]);
    }
  }, [noticeForm?.values?.mainNoticeFileDestination, noticeForm?.values?.mainNoticeFileName]);

  const fetchNoticeData = async (noticeRef) => {
    setLoading(loadingStates.LOADING);
    const response = await apiWrapWithErrorWithData(fetchNoticeDetails(
      { noticeRef },
    ));
    setLoading(loadingStates.NO_ACTIVE_REQUEST);
    if (response?.success && response?.noticeData?.json) {
      noticeForm.setValues(flat(response.noticeData.json));
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Request',
        message: 'Failed to load notice request.',
      });
    }
  };

  useEffect(() => {
    if (noticeConfigs.noticeReference && noticeConfigs.loadPreBuiltNotice) {
      fetchNoticeData(noticeConfigs.noticeReference);
    }
  }, []);

  const [noticeFormView, setNoticeFormView] = useState({
    overRideJSONViewShow: false,
    noticeBuildForm1: true,
    noticeBuildForm2: false,
    noticeBuildForm3: false,
    noticeBuildForm4: false,
    showDevJson: false,
    addressAddFormShow: false,
  });

  const noticeFormValuesUnflatted = (flat.unflatten(noticeForm.values));

  const saveNotice = async () => {
    let mainNoticeFileDestination = null;
    let mainNoticeFileName = null;
    if (files.length) {
      if (files?.[0]?.destination && files?.[0]?.filename) {
        mainNoticeFileDestination = files[0].destination;
        mainNoticeFileName = files[0].filename;
      }
    }
    const noticeJson = noticeFormValuesUnflatted;
    const noticeFlatted = noticeForm.values;
    const noticeSource = noticeConfigs.requestReference ? 'request' : 'notice';
    let response = null;
    setLoading(loadingStates.LOADING);
    if (noticeSource === 'request') {
      response = await apiWrapWithErrorWithData(buildNewNotice({
        requestRefNum: noticeConfigs.requestReference,
        noticeData: {
          json: { ...noticeJson, mainNoticeFileDestination, mainNoticeFileName },
          flatted: { ...noticeFlatted, mainNoticeFileDestination, mainNoticeFileName },
        },
      }));
      onClose();
    }
    if (noticeSource === 'notice') {
      // requestRefNum
      response = await apiWrapWithErrorWithData(updateNotice({
        noticeRef: noticeConfigs.noticeReference,
        noticeData: {
          json: { ...noticeJson, mainNoticeFileDestination, mainNoticeFileName },
          flatted: { ...noticeFlatted, mainNoticeFileDestination, mainNoticeFileName },
        },
      }));
    }
    setLoading(loadingStates.NO_ACTIVE_REQUEST);
    if (!response?.success) {
      showNotification({
        color: 'red',
        title: 'Notice',
        message: 'Failed to save notice.',
      });
      return false;
    }
    return true;
  };

  const validateStep = (step) => {
    let errored = false;
    if (noticeFormValuesUnflatted.sender.length === 0) {
      errored = true;
    }
    if (noticeFormValuesUnflatted.recipient.length === 0) {
      errored = true;
    }
    const keys = {};
    if (step === 1) {
      const recipientValidationResults = noticeFormValuesUnflatted.recipient.map(
        validateAddress,
      );
      const senderValidationResults = noticeFormValuesUnflatted.sender.map(
        validateAddress,
      );
      recipientValidationResults.forEach((validationResult, parentIndex) => {
        const { erroredKeys } = validationResult;
        erroredKeys.forEach((errorKey) => {
          keys[`recipient.${parentIndex}.${errorKey}`] = 'Please check this field.';
        });
      });
      senderValidationResults.forEach((validationResult, parentIndex) => {
        const { erroredKeys } = validationResult;
        erroredKeys.forEach((errorKey) => {
          keys[`sender.${parentIndex}.${errorKey}`] = 'Please check this field.';
        });
      });
    }
    if (errored || Object.keys(keys).length > 0) {
      noticeForm.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Notice Form',
        message: 'Please check all fields are filled properly.',
      }));
      return false;
    }
    return true;
  };

  const navBtnHandler = (initialString, currentStep, handlerFun, handlerValues) => ({
    previous: async () => {
      if (validateStep(currentStep) && (await saveNotice())) {
        handlerFun({
          ...handlerValues,
          [`${initialString}${currentStep}`]: false,
          [`${initialString}${currentStep - 1}`]: true,
        });
      }
    },
    next: async () => {
      if (validateStep(currentStep) && (await saveNotice())) {
        handlerFun({
          ...handlerValues,
          [`${initialString}${currentStep}`]: false,
          [`${initialString}${currentStep + 1}`]: true,
        });
      }
    },
  });

  useEffect(() => {
    if (!(noticeFormView.noticeBuildForm1
          || noticeFormView.noticeBuildForm2
          || noticeFormView.noticeBuildForm3
          || noticeFormView.noticeBuildForm4)) {
      onClose();
    }
  }, [noticeFormView]);

  const toggleValueHandler = (name) => () => {
    setNoticeFormView({
      ...noticeFormView,
      [name]: !noticeFormView[name],
    });
  };

  const devBtn = ({
    button: (
      noticeFormView.overRideJSONViewShow
        ? (
          <Button onClick={toggleValueHandler('showDevJson')}>
            Show JSON
          </Button>
        ) : null),
    modal: (
      <Modal size="calc(50vw)" opened={noticeFormView.showDevJson} onClose={toggleValueHandler('showDevJson')}>
        <Code block>
          {JSON.stringify(noticeForm.values, null, '\t')}
        </Code>
      </Modal>),
  });

  // const dispatch = useDispatch();

  const addOptionsInSettingsArray = async ({
    newOption, key,
  }) => {
    const newSettings = {
      ...workSpaceSettings,
      [key]: [...(workSpaceSettings[key] || []), {
        label: newOption,
        value: newOption,
      }],
    };
    putSettingsInFirebaseDb({ settingsData: newSettings });
    // const newSettings = {
    //   ...workSpaceSettings,
    //   [key]: [...workSpaceSettings[key], {
    //     label: newOption,
    //     value: newOption,
    //   }],
    // };
    // const response = await apiWrapWithErrorWithData(saveSettings({
    //   settingsData: newSettings,
    // }));
    // if (response?.success) {
    //   dispatch({
    //     type: actions.SET_WORKSPACE_SETTINGS,
    //     payload: newSettings,
    //   });
    // } else {
    //   showNotification({
    //     autoClose: 5000,
    //     title: 'Settings',
    //     message: 'Couldn\'t save settings',
    //   });
    // }
  };

  useEffect(() => {
    if (noticeForm.values.noticeDirection === 'Outgoing') {
      noticeForm.setValues(flat({
        ...noticeFormValuesUnflatted,
        recipient: [{ ...formSettings.senderOrReceiver }],
        sender: [],
      }));
    }
    if (noticeForm.values.noticeDirection === 'Incoming') {
      noticeForm.setValues(flat({
        ...noticeFormValuesUnflatted,
        sender: [{ ...formSettings.senderOrReceiver }],
        recipient: [],
      }));
    }
  }, [noticeForm.values.noticeDirection]);

  const addNewSenderOrReceiver = () => {
    const keyToManage = noticeForm.values.noticeDirection === 'Outgoing' ? 'recipient' : 'sender';
    const arr = noticeFormValuesUnflatted[keyToManage];
    arr.push({ ...formSettings.senderOrReceiver });
    const arrFlatted = flat({ [keyToManage]: arr });
    noticeForm.setValues({
      ...noticeForm.values,
      ...arrFlatted,
    });
  };

  const deleteSenderOrReceiver = (toRemoveIndex) => {
    const keyToManage = noticeForm.values.noticeDirection === 'Outgoing' ? 'recipient' : 'sender';
    const arr = noticeFormValuesUnflatted[keyToManage];
    if (arr.length === 1) {
      return;
    }
    const newArr = arr.filter((v, i) => i !== toRemoveIndex);
    const jsonForm = noticeFormValuesUnflatted;
    jsonForm[keyToManage] = newArr;
    noticeForm.setValues(flat(jsonForm));
  };

  const setSelectedAddr = ({
    keyToManage, payload,
  }) => {
    const jsonForm = noticeFormValuesUnflatted;
    const found = jsonForm[keyToManage].filter((addr) => addr.addressId === payload.addressId);
    if (found && found.length) {
      jsonForm[keyToManage] = jsonForm[keyToManage].filter((addr) => addr.addressId !== payload.addressId);
      noticeForm.setValues(flat(jsonForm));
    } else {
      jsonForm[keyToManage].push(payload);
      noticeForm.setValues(flat(jsonForm));
    }
  };

  const addressWithAccordion = (keyToManage) => (
    <div>
      <Accordion multiple={false} className="my-4">
        {(noticeFormValuesUnflatted)[keyToManage].map(
          (recipient, index, arr) => {
            const context = `${keyToManage}.${index}`;
            const showName = noticeForm.values[`${context}.name`].length && `${noticeForm.values[`${context}.name`]}`;
            const labelDiv = (
              <div className="flex flex-row justify-between items-center">
                <Text
                  size="sm"
                >
                  {showName.length ? showName : `${keyToManage.toLocaleLowerCase()} ${index + 1}`}
                </Text>
                <div className="flex flex-row">
                  {arr.length > 1
                                    && (
                                    <ActionIcon
                                      color="red"
                                      variant="hover"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSenderOrReceiver(index);
                                      }}
                                    >
                                      <Trash size={16} />
                                    </ActionIcon>
                                    )}
                </div>
              </div>
            );
            return (
              <Accordion.Item className="m-0 border-2 my-2" label={labelDiv} iconPosition="right">
                <div className="flex flex-col">
                  <SegmentedControl
                    color="blue"
                    data={
                                            [
                                              { value: 'Individual', label: 'Individual' },
                                              { value: 'Entity', label: 'Entity' },
                                            ]
                                        }
                    {...noticeForm.getInputProps(`${context}.type`)}
                  />
                  <Space h="xs" />
                  <TextInput required label="Name" placeholder="Enter Name" {...noticeForm.getInputProps(`${context}.name`)} />
                  <Space h="xs" />
                  <TextInput
                    required
                    placeholder="Enter Email"
                    label="Email"
                    {...noticeForm.getInputProps(`${context}.email`)}
                  />
                  <Space h="xs" />

                  {noticeForm.values[`${context}.type`] === 'Individual' && (
                  <>
                    <TextInput
                      required
                      placeholder="Enter 10 digit phone no."
                      label="Phone"
                      type="number"
                      {...noticeForm.getInputProps(`${context}.phone`)}
                    />
                    <Space h="xs" />
                    <TextInput
                      required
                      placeholder="S/o"
                      label="S/o"
                      {...noticeForm.getInputProps(`${context}.sonOf`)}
                    />
                    <Space h="xs" />
                    <Textarea
                      required
                      placeholder="Enter Residence"
                      label="Residence"
                      {...noticeForm.getInputProps(`${context}.residenceOf`)}
                    />
                    <Space h="xs" />
                  </>
                  )}

                  {noticeForm.values[`${context}.type`] === 'Entity' && (
                  <>
                    <Select
                      label="Entity Type"
                      required
                      data={[
                        { value: 'Company', label: 'Company' },
                        { value: 'LLP', label: 'LLP' },
                        { value: 'Partnership Firm', label: 'Partnership Firm' },
                        { value: 'Sole Proprietary', label: 'Sole Proprietary' },
                      ]}
                      {...noticeForm.getInputProps(`${context}.companyType`)}
                    />
                    <Space h="xs" />
                    <Textarea
                      required
                      label="Registered Office Address"
                      {...noticeForm.getInputProps(`${context}.registeredOfficeAddress`)}
                    />
                    <Space h="xs" />
                    <Textarea
                      required
                      label="Corporate Office Address"
                      {...noticeForm.getInputProps(`${context}.corporateOfficeAddress`)}
                    />
                    <Space h="xs" />
                  </>
                  )}
                </div>
              </Accordion.Item>
            );
          },
        )}
      </Accordion>
      <Button onClick={addNewSenderOrReceiver}>{`ADD ${keyToManage.toUpperCase()}`}</Button>
    </div>
  );

  const addressFromSettings = (keyToManage) => (
    <div className="flex flex-col">
      {workSpaceSettings.addresses.map(
        (addr) => {
          const selected = ((noticeFormValuesUnflatted)[keyToManage]?.filter((addrSel) => addrSel.addressId === addr.addressId)).length > 0;
          return (
            <AddressRender
              selected={selected}
              onClick={() => {
                setSelectedAddr({ keyToManage, payload: addr });
              }}
              addr={addr}
            />
          );
        },
      )}
      <Button onClick={() => {
        setNoticeFormView({
          ...noticeFormView,
          addressAddFormShow: true,
        });
      }}
      >
        {`ADD ${keyToManage.toUpperCase()}`}
      </Button>
    </div>
  );
  const recipientRenderer = () => {
    const keyToManage = 'recipient';
    if (noticeForm.values.noticeDirection === 'Outgoing') {
      return addressWithAccordion(keyToManage);
    }
    return addressFromSettings(keyToManage);
  };

  const senderRender = () => {
    const keyToManage = 'sender';
    if (noticeForm.values.noticeDirection === 'Incoming') {
      return addressWithAccordion(keyToManage);
    }
    return addressFromSettings(keyToManage);
  };

  return (
    <>
      {/* <Button className="my-2" onClick={toggleValueHandler('noticeBuildForm1')}> */}
      {/*  Start Approved Notice */}
      {/* </Button> */}
      {/* first form -- start */}
      <Modal
        overflow="inside"
        closeOnClickOutside={false}
        size="calc(50vw)"
        opened={noticeFormView.noticeBuildForm1}
        onClose={toggleValueHandler('noticeBuildForm1')}
        title={loading === loadingStates.LOADING
          ? <BeatLoader color={colors.primary} size={10} />
          : <Text>Build New Notice</Text>}
      >
        {devBtn.button}
        {devBtn.modal}
        <div className="my-2">
          Notice:
        </div>
        <div className="w-80">
          <SegmentedControl
            color="blue"
            data={
                            [
                              { value: 'Incoming', label: 'Incoming' },
                              { value: 'Outgoing', label: 'Outgoing' },
                            ]
                        }
            {...noticeForm.getInputProps('noticeDirection')}
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-80 flex flex-col">
            <div className="my-2">
              To
            </div>
            {recipientRenderer()}
          </div>
          <div className="w-80 flex flex-col">
            <div className="my-2">
              From
            </div>
            {senderRender()}
          </div>
        </div>
        <div className="flex flex-row w-full justify-between mt-4 mb-2">
          <div />
          <Button onClick={navBtnHandler('noticeBuildForm', 1, setNoticeFormView, noticeFormView).next}>
            Next
          </Button>
        </div>
      </Modal>
      {/* first form -- end */}

      {/* second form -- start */}
      <Modal
        overflow="inside"
        closeOnClickOutside={false}
        size="calc(50vw)"
        opened={noticeFormView.noticeBuildForm2}
        onClose={toggleValueHandler('noticeBuildForm2')}
        title="Build New Notice"
      >
        <div className="w-1/2 flex flex-col">
          <div className="flex flex-col">
            <div className="my-2">
              Purpose
            </div>
            {devBtn.button}
            {devBtn.modal}
            <SegmentedControl
              color="blue"
              data={
                                [
                                  { value: 'Money Recovery', label: 'Money Recovery' },
                                  { value: 'Others', label: 'Others' },
                                ]
                            }
              {...noticeForm.getInputProps('purpose.type')}
            />
          </div>

          <Space h="xs" />

          {noticeForm.values['purpose.type'] === 'Money Recovery' && (
              <Select
                  className="mx-2"
                  label="Select Subtype"
                  data={workSpaceSettings.noticeFormPurposeMoneyRecoveryAdditionalOptions || []}
                  placeholder="Type or select"
                  nothingFound="Nothing found"
                  searchable
                  creatable
                  value={noticeForm.getInputProps('purpose.MoneyRecovery.subType').value}
                  getCreateLabel={(query) => `+ ${query}`}
                  onCreate={(query) => {

                    const newSettings = {
                      ...workSpaceSettings,
                      noticeFormPurposeMoneyRecoveryAdditionalOptions: [...(workSpaceSettings['noticeFormPurposeMoneyRecoveryAdditionalOptions'] || []), {
                        label: query,
                        value: query,
                      }],
                    };
                    putSettingsInFirebaseDb({ settingsData: newSettings });

                    // const newSettings = {
                    //   ...workspaceSettings,
                    //   caseTypes: [...(caseTypes || []), {
                    //     label: query,
                    //     value: query,
                    //   }],
                    // };
                    // putSettingsInFirebaseDb({ settingsData: newSettings });
                  }}
                  {...noticeForm.getInputProps('purpose.MoneyRecovery.subType')}
              />
          )}

          {noticeForm.values['purpose.type'] === 'Others' && (
              <Select
            className="mx-2"
            label="Select Subtype"
            data={workSpaceSettings.noticeFormPurposeOthersAdditionalOptions || []}
            placeholder="Type or select"
            nothingFound="Nothing found"
            searchable
            creatable
            value={noticeForm.getInputProps('purpose.Others.subType').value}
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={(query) => {

            const newSettings = {
            ...workSpaceSettings,
            noticeFormPurposeOthersAdditionalOptions: [...(workSpaceSettings['noticeFormPurposeOthersAdditionalOptions'] || []), {
            label: query,
            value: query,
          }],
          };
            putSettingsInFirebaseDb({ settingsData: newSettings });

            // const newSettings = {
            //   ...workspaceSettings,
            //   caseTypes: [...(caseTypes || []), {
            //     label: query,
            //     value: query,
            //   }],
            // };
            // putSettingsInFirebaseDb({ settingsData: newSettings });
          }}
          {...noticeForm.getInputProps('purpose.Others.subType')}
            />
          )}

        </div>
        <div className="flex flex-row w-full justify-between mt-4 mb-2">
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 2, setNoticeFormView, noticeFormView).previous}
          >
            Previous
          </Button>
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 2, setNoticeFormView, noticeFormView).next}
          >
            Next
          </Button>
        </div>
      </Modal>
      {/* second form -- end */}

      {/* third form -- start */}
      <Modal
        overflow="inside"
        closeOnClickOutside={false}
        size="calc(50vw)"
        opened={noticeFormView.noticeBuildForm3}
        onClose={toggleValueHandler('noticeBuildForm3')}
        title="Build New Notice"
      >
        <div className="w-1/3 flex flex-col">
          {devBtn.button}
          {devBtn.modal}
          <Select
            label="Notice Period"
            required
            data={
                            [{ label: '7 Days', value: '7 Days' },
                              { label: '15 Days', value: '15 Days' },
                              { label: '30 Days', value: '30 Days' },
                            ]
                        }
            {...noticeForm.getInputProps('noticePeriod')}
          />
        </div>
        <div className="flex flex-row w-full justify-between mt-4 mb-2">
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 3, setNoticeFormView, noticeFormView).previous}
          >
            Previous
          </Button>
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 3, setNoticeFormView, noticeFormView).next}
          >
            Next
          </Button>
        </div>
      </Modal>
      {/* third form -- end */}

      {/* fourth form -- start */}
      <Modal
        overflow="inside"
        closeOnClickOutside={false}
        size="calc(50vw)"
        opened={noticeFormView.noticeBuildForm4}
        onClose={toggleValueHandler('noticeBuildForm4')}
        title="Build New Notice"
      >
        <div className="flex flex-col">
          {devBtn.button}
          {devBtn.modal}
          <DocumentUploader
            subTitle="You can upload single .pdf file which will be main notice file."
            dropZoneConfigs={{
              accept: MIME_TYPES.pdf,
              multiple: false,
            }}
            files={files}
            setFiles={setFiles}
          />
          <Space h="xs" />
        </div>
        <div className="flex flex-row w-full justify-between mt-4 mb-2">
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 4, setNoticeFormView, noticeFormView).previous}
          >
            Previous
          </Button>
          <Button
            disabled={loading === loadingStates.LOADING}
            onClick={navBtnHandler('noticeBuildForm', 4, setNoticeFormView, noticeFormView).next}
          >
            Finish
          </Button>
        </div>
      </Modal>
      {/* fourth form -- end */}
      <AddressAddModal
        opened={noticeFormView.addressAddFormShow}
        setClose={() => {
          setNoticeFormView({
            ...noticeFormView,
            addressAddFormShow: false,
          });
        }}
      />
    </>
  );
};

export default NoticeForm;
