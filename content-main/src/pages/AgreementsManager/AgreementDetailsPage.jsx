/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
// import {
//   Button, Skeleton, Tabs, Text, Badge,
// } from '@mantine/core';
import {
  Button, Skeleton, Tabs, Text,
} from '@mantine/core';
// import {
//   addDays, formatDistanceStrict, parseISO,
// } from 'date-fns';
import { formatDistanceStrict } from 'date-fns';
// import { useNavigate, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
// import {
//   Settings, Paperclip, Check, CloudUpload,
// } from 'tabler-icons-react';
import {
  Settings, Paperclip,
} from 'tabler-icons-react';
import { useDebouncedValue } from '@mantine/hooks';
// import TextWithLabel from '../../components/TextWithLabel';
// import { formatDate, loadingStates } from '../../utilities/utilities';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import colors from '../../utilities/design';
import {
  getAgreementDetails,
  getPreviewUrl,
  updateAgreement,
} from '../../utilities/apis/agreements';
import Editor from '../../components/Editor';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';
import TasksTab from '../../components/TasksTab/TasksTab';
import ExpensesTab from '../../components/ExpensesTab/ExpensesTab';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import AgreementSignature from '../../components/AgreementSignature/AgreementSignature';
import AgreementDetail from '../../components/AgreementDetail/AgreementDetail';
import EmailTab from '../../components/EmailTab/EmailTab';

const AgreementDetailsPage = () => {
  const { agreementId } = useParams();
  const [agreementData, setAgreementData] = useState({
    loaded: false,
    agreementId: agreementId || null,
    data: null,
    // agreementStatus: '',
  });
  const data = agreementData.data?.json;
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    activeTab: 'contract',
    filesLoading: loadingStates.NO_ACTIVE_REQUEST,
    loadingContract: loadingStates.NO_ACTIVE_REQUEST,
    previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST,
    lastSaved: new Date(),
    lastSavedText: (formatDistanceStrict(new Date(), new Date(), {
      addSuffix: true,
    })),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setUiConfigs((stateC) => ({
        ...stateC,
        lastSavedText: (formatDistanceStrict(stateC.lastSaved, new Date(), {
          addSuffix: true,
        })),
      }));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [contractHtml, setContractHtml] = useState(null);

  const openPreviewUrl = async () => {
    setUiConfigs({ ...uiConfigs, previewPdfLoading: loadingStates.LOADING });
    const { url } = await getPreviewUrl(contractHtml).catch(() => {
      showNotification({
        color: 'red',
        message: 'Could not load preview.',
        title: 'PDF Preview',
      });
      setUiConfigs({ ...uiConfigs, previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST });
    });
    if (url && url.length) {
      window.open(url, '_blank').focus();
    } else {
      showNotification({
        color: 'red',
        message: 'Could not load preview.',
        title: 'PDF Preview',
      });
    }
    setUiConfigs({ ...uiConfigs, previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST });
  };

  const fetchAgreementData = async (agreementIdIncoming) => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getAgreementDetails(
      { agreementId: agreementIdIncoming },
    ));
    if (response?.success && response.agreement?.agreementData) {
      setAgreementData({
        ...agreementData,
        data: response.agreement?.agreementData,
        wholeAgreement: response.agreement,
        loaded: true,
        agreementStatus: response.agreement?.status,
      });
      // setFiles(((response.agreement?.agreementData?.json?.documents || []).map((file) => ({
      //   ...file,
      //   uploadStarted: true,
      //   uploadedComplete: true,
      // }))));
      setContractHtml((response?.agreement?.contractQuillJsDelta));
    } else {
      showNotification(({
        color: 'red',
        title: 'Agreement',
        message: 'Something went wrong.',
      }));
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };
  useEffect(() => {
    if (agreementData.agreementId) {
      fetchAgreementData(agreementData.agreementId);
    } else {
      showNotification(({
        color: 'red',
        title: 'Case',
        message: 'No agreementId found',
      }));
    }
  }, [agreementData.agreementId]);

  // const navigate = useNavigate();

  const [debouncedContractHtml] = useDebouncedValue(contractHtml, 1000, { leading: true });
  const saveAgreementContract = async (html) => {
    if (!data) {
      return;
    }
    setUiConfigs((stateC) => ({
      ...stateC,
      loadingContract: loadingStates.LOADING,
    }));
    const agreementResp = await apiWrapWithErrorWithData(updateAgreement({
      agreementId,
      agreementData: ({
        ...agreementData.data,
        flatted: {
          ...agreementData.data.flatted,
        },
        json: {
          ...agreementData.data.json,
        },
      }),
      contractQuillJsDelta: html,
    }));
    if (agreementResp && agreementResp.success) {
      setUiConfigs((stateC) => ({
        ...stateC,
        loadingContract: loadingStates.NO_ACTIVE_REQUEST,
        lastSaved: new Date(),
        lastSavedText: (formatDistanceStrict(new Date(), new Date(), {
          addSuffix: true,
        })),
      }));
    } else {
      setUiConfigs((stateC) => ({
        ...stateC,
        loadingContract: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        message: 'Error in saving agreement data.',
        title: 'Agreement',
        color: 'red',
      });
    }
  };
  useEffect(() => {
    saveAgreementContract(debouncedContractHtml);
  }, [debouncedContractHtml]);

  const multiUploadArgs = useMultiFileUpload({ loadFromParent: true, parentId: agreementId, parent: 'agreement' });

  return (
    <>
      <div className="flex flex-col">
        {uiConfigs.loading === loadingStates.LOADING
                    && (
                    <div className="flex flex-col mb-2 mt-8">
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={60} radius="md" className="mt-4 w-full" />
                      <Skeleton height={60} radius="md" className="mt-4 w-full" />
                      <Skeleton height={60} radius="md" className="mt-4 w-full" />
                      <Skeleton height={60} radius="md" className="mt-4 w-full" />
                    </div>
                    )}
      </div>
      {(agreementData.loaded && data)
                && (
                <div className="flex flex-col mb-20">
                  <AgreementDetail {...agreementData.wholeAgreement} />
                  {/* <Text size="md" color="#46BDE1" className="mt-4">Contract Details</Text>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                      <TextWithLabel className="mx-4" label="Type" text={data.typeOfAgreement} />
                      <TextWithLabel className="ml-0 mr-4" label="Contract Date" text={formatDate(data.dateOfContract)} />
                      <TextWithLabel className="mx-4" label="Contract Term (in days)" text={data.termOfContractInDays || '-'} />
                      {(data.dateOfContract && data.termOfContractInDays)
                          && (
                          <TextWithLabel
                            className="mx-4"
                            label="Contract End Date"
                            text={
                                formatDate(addDays(parseISO(data.dateOfContract), data.termOfContractInDays))
                              }
                          />
                          )}
                            </div> */}
                  {/* <div className="flex flex-row">
                    {uiConfigs.loading === loadingStates.LOADING
                      ? <BeatLoader color={colors.primary} size={10} />
                      : (
                        <>
                          <Button onClick={() => {
                            navigate('/app/agreements/edit', {
                              state: {
                                agreementId: agreementData.agreementId,
                              },
                            });
                          }}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                  </div> */}
                  {/*
                  </div>
                  <Text size="md" color="#46BDE1" className="mt-4">Requesting User</Text>
                  <div className="flex flex-col">
                    <div className="flex flex-row my-2">
                      <TextWithLabel className="mx-4" label="Name" text={data.requestingUser.name || '-'} />
                      <TextWithLabel className="mx-4" label="Email" text={data.requestingUser.email || '-'} />
                      <TextWithLabel className="mx-4" label="Phone" text={data.requestingUser.email || '-'} />
                      <TextWithLabel className="mx-4" label="Designation" text={data.requestingUser.email || '-'} />
                      <TextWithLabel className="mx-4" label="Department" text={data.requestingUser.email || '-'} />
                    </div>
                  </div>
                  <Text size="md" color="#46BDE1" className="mt-4">First Party</Text>
                  <div className="flex flex-col">
                    <div className="flex flex-row my-2">
                      <TextWithLabel className="mx-4" label="Name" text={data.firstParty.name || '-'} />
                      <TextWithLabel className="mx-4" label="Email" text={data.firstParty.email || '-'} />
                      <TextWithLabel
                        className="mx-4"
                        label="Address"
                        text={data.firstParty.address || '-'}
                      />
                    </div>
                    <div className="flex flex-row my-2">
                      <TextWithLabel className="mx-4" label="Representative" text={data.firstParty?.representative || '-'} />
                      <TextWithLabel className="mx-4" label="Signatory" text={data.firstParty?.signatory || '-'} />
                    </div>
                  </div>

                  <Text size="md" color="#46BDE1" className="my-2">Second Party</Text>
                  <div className="flex flex-col">
                    <div className="flex flex-row mt-4">
                      <TextWithLabel className="mx-4" label="Name" text={data.secondParty.name || '-'} />
                      <TextWithLabel className="mx-4" label="Email" text={data.secondParty.email || '-'} />
                      <TextWithLabel
                        className="mx-4"
                        label="Address"
                        text={data.secondParty.address || '-'}
                      />
                    </div>
                    <div className="flex flex-row my-2">
                      <TextWithLabel className="mx-4" label="Representative" text={data.secondParty?.representative || '-'} />
                      <TextWithLabel className="mx-4" label="Signatory" text={data.secondParty?.signatory || '-'} />
                    </div>
                  </div> */}

                  <Tabs
                    value={uiConfigs.activeTab}
                    onTabChange={(tab) => {
                      setUiConfigs((stateC) => ({
                        ...stateC,
                        activeTab: tab,
                      }));
                    }}
                  >
                    <Tabs.List>
                      <Tabs.Tab value="contract">Contract</Tabs.Tab>
                      <Tabs.Tab value="signature">Signature</Tabs.Tab>
                      <Tabs.Tab value="emails">Emails</Tabs.Tab>
                      <Tabs.Tab value="documents">Documents</Tabs.Tab>
                      <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
                      <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="contract" label="Contract" icon={<Paperclip size={14} />}>
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-end m-4">
                          {/* {uiConfigs.loadingContract === loadingStates.LOADING && (
                          <Badge size="xl" color="green">
                            <div className="flex items-center">
                              <CloudUpload size={20} />
                              <Text className="ml-2 lowercase">Saving...</Text>
                            </div>
                          </Badge>
                          )} */}
                          {/* {(uiConfigs.loadingContract === loadingStates.NO_ACTIVE_REQUEST
                                  && uiConfigs.lastSaved)
                                  && (
                                  <Badge size="xl" color="green">
                                    <div className="flex items-center">
                                      <Check size={20} />
                                      <Text className="ml-2 lowercase">
                                        Last saved
                                        {` ${uiConfigs.lastSavedText}`}
                                      </Text>
                                    </div>
                                  </Badge>
                                  )} */}
                          <div className="flex">
                            {uiConfigs.loadingContract !== loadingStates.LOADING && (
                            <>
                              <Button
                                color="cyan"
                                onClick={
                                () => {
                                  saveAgreementContract(contractHtml);
                                }
                              }
                                disabled={uiConfigs.loadingContract === loadingStates.LOADING}
                                className="w-40 mx-4"
                              >
                                <Text>Save Contract</Text>
                              </Button>
                              <Button color="gray" onClick={openPreviewUrl} disabled={uiConfigs.previewPdfLoading === loadingStates.LOADING} className="w-60 mx-4">
                                {uiConfigs.previewPdfLoading === loadingStates.LOADING
                                  ? <BeatLoader size={10} color={colors.primary} />
                                  : <Text>Open in new tab</Text>}
                              </Button>
                            </>
                            )}
                          </div>
                        </div>
                        {(debouncedContractHtml)
                          ? (
                            <div className="flex flex-col items-center">
                              {agreementData?.wholeAgreement?.isAgreementLocked
                                  && <div className="my-2">Agreement is locked/sent for signature and cannot be edited.</div>}
                              <Editor locked={agreementData.wholeAgreement.isAgreementLocked} content={debouncedContractHtml} onContentChange={setContractHtml} />
                            </div>
                          ) : null}
                      </div>
                    </Tabs.Panel>
                    <Tabs.Panel value="signature" label="Signature" icon={<Settings size={14} />}>
                      {uiConfigs.activeTab === 'signature' && (
                      <AgreementSignature
                        reloadAgreement={() => fetchAgreementData(agreementId)}
                        emails={[data?.firstParty?.email, data?.secondParty?.email]}
                        names={[data?.firstParty?.name, data?.secondParty?.name]}
                        quillDelta={debouncedContractHtml}
                        agreementId={agreementData.agreementId}
                      />
                      )}
                    </Tabs.Panel>
                    <Tabs.Panel label="Emails" value="emails">
                      <EmailTab parent="agreement" parentId={agreementId} />
                    </Tabs.Panel>
                    <Tabs.Panel label="Documents" value="documents">
                      <div className="p-6">
                        <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
                      </div>
                    </Tabs.Panel>
                    <Tabs.Panel label="Tasks" value="tasks">
                      <TasksTab parent="agreement" parentId={agreementId} />
                    </Tabs.Panel>
                    <Tabs.Panel label="Expenses" value="expenses">
                      <ExpensesTab parent="agreement" parentId={agreementId} />
                    </Tabs.Panel>
                  </Tabs>

                </div>
                )}
    </>
  );
};

export default AgreementDetailsPage;
