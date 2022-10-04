import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import {
  Badge, Button, Skeleton, Tabs, Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { formatDistanceStrict } from 'date-fns';
import { Check, CloudUpload } from 'tabler-icons-react';
import { BeatLoader } from 'react-spinners';
import { formatDate, formatTime, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { fetchNoticeDetails, updateNotice } from '../../utilities/apis/notices';
import styles from '../../components/NoticeDetail/NoticeDetail.module.css';
import { noticeStatusColors } from '../../utilities/enums';
import AddressRenderer from '../../components/CaseDetails/AddressRenderer';
import { getPreviewUrl } from '../../utilities/apis/agreements';
import colors from '../../utilities/design';
import Editor from '../../components/Editor';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';
import TasksTab from '../../components/TasksTab/TasksTab';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import EmailTab from '../../components/EmailTab/EmailTab';
import ExpensesTab from '../../components/ExpensesTab/ExpensesTab';
// import EmailBox from '../../components/EmailBox';

const NoticeDetailsPage = () => {
  const { noticeId: noticeIdFromUrl } = useParams();
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    activeTab: 'notice',
    loadingContract: loadingStates.NO_ACTIVE_REQUEST,
    previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST,
    lastSaved: new Date(),
    lastSavedText: (formatDistanceStrict(new Date(), new Date(), {
      addSuffix: true,
    })),
    emailBoxView: false,
  });

  const [configs, setConfigs] = useState({
    noticeDetails: null,
  });

  const [contractHtml, setContractHtml] = useState(null);
  const [debouncedContractHtml] = useDebouncedValue(contractHtml, 1000, { leading: true });

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

  const fetchNotice = async (noticeId) => {
    setUiConfigs((stateC) => ({
      ...stateC,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(fetchNoticeDetails({ noticeId }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        noticeDetails: {
          noticeId: resp.notice.id,
          notice: resp.notice,
          noticeData: resp.notice.noticeData,
        },
      }));
      setContractHtml(resp.notice?.noticeData?.json?.contractHtml || '<p>Agreement information goes here.</p>');
      setUiConfigs((stateC) => ({
        ...stateC,
        noticeLoaded: true,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      setUiConfigs((stateC) => ({
        ...stateC,
        noticeLoaded: true,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        title: 'Notice Details',
        message: 'Something went wrong.',
      });
    }
  };

  const notice = configs.noticeDetails?.notice;
  const noticeData = configs.noticeDetails?.noticeData?.json;
  const noticeId = configs.noticeDetails?.noticeId;

  useEffect(() => {
    let interval = null;
    if (uiConfigs.activeTab === 'notice') {
      interval = setInterval(() => {
        setUiConfigs((stateC) => ({
          ...stateC,
          lastSavedText: (formatDistanceStrict(stateC.lastSaved, new Date(), {
            addSuffix: true,
          })),
        }));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [uiConfigs.activeTab]);

  const multiUploadArgs = useMultiFileUpload({
    parent: 'notice',
    parentId: noticeIdFromUrl,
  });

  const saveNoticeContract = async (html) => {
    if (!noticeData) {
      return;
    }
    setUiConfigs((stateC) => ({
      ...stateC,
      loadingContract: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(updateNotice({
      noticeId,
      noticeData: ({
        ...notice.noticeData,
        flatted: {
          ...notice.noticeData.flatted,
          contractHtml: html,
        },
        json: {
          ...notice.noticeData.json,
          contractHtml: html,
        },
      }),
    }));
    if (resp && resp.success) {
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
        message: 'Error in saving notice data.',
        title: 'Notice',
        color: 'red',
      });
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    saveNoticeContract(debouncedContractHtml);
  }, [debouncedContractHtml]);

  useEffect(() => {
    if (noticeIdFromUrl) {
      fetchNotice(noticeIdFromUrl);
    } else {
      navigate('/app');
    }
  }, []);

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
        {(!!configs.noticeDetails && uiConfigs.loading !== loadingStates.LOADING)

            && (
            <div className="flex flex-col pt-7 pl-4 pr-7">
              <div className={styles.title}>
                Notice -
                {noticeId}
              </div>
              <div className="flex flex-row justify-between items-center mt-2">
                <div className="flex flex-row">
                  <div className="flex flex-row mr-4">
                    <img className="pr-2" src="/assets/images/calendar.svg" alt="calendar" />
                    <span className={styles.dateTime}>
                      Created on
                      {' '}
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-row mr-4">
                    <img className="pr-2" src="/assets/images/clock.svg" alt="clock" />
                    <span className={styles.dateTime}>
                      {' '}
                      {formatTime(notice.createdAt)}
                    </span>
                  </div>
                </div>
                <div>
                  <Badge size="lg" color={noticeStatusColors[notice.status] || 'orange'}>
                    {notice.status}
                  </Badge>
                  {/* <Button */}
                  {/*  className="ml-4" */}
                  {/*  style={{ */}
                  {/*    backgroundColor: '#46BDE1', */}
                  {/*    borderRadius: '0.5rem', */}
                  {/*    color: '#F5F5F5', */}
                  {/*    width: '180px', */}
                  {/*  }} */}
                  {/* > */}
                  {/*  Edit */}
                  {/* </Button> */}
                </div>
              </div>
              <div className="mt-4">
                <div className={styles.title}>Sender</div>
                {/* <SenderDetail {...noticeData.sender} /> */}
                {noticeData.senders.map((obj) => <AddressRenderer {...obj} />)}
              </div>
              <div className="mt-6">
                <div className={styles.title}>Receipient</div>
                {/* <SenderDetail {...receipientDetail} /> */}
                {noticeData.receivers.map((obj) => <AddressRenderer {...obj} />)}
              </div>

              <div className="grid grid-cols-3 mt-7">
                <div>
                  <div className={styles.label}>Purpose</div>
                  <div className={styles.text}>{noticeData.noticePurpose}</div>
                </div>

                <div>
                  <div className={styles.label}>Sub Purpose</div>
                  <div className={styles.text}>{noticeData.noticeSubPurpose}</div>
                </div>
                <div>
                  <div className={styles.label}>Notice Period</div>
                  <div className={styles.text}>{`${noticeData.noticePeriodDays} Days`}</div>
                </div>
              </div>
              <Tabs
                className="mt-4"
                value={uiConfigs.activeTab}
                onTabChange={(tab) => {
                  setUiConfigs({
                    ...uiConfigs,
                    activeTab: tab,
                  });
                }}
              >
                <Tabs.List>
                  <Tabs.Tab value="notice">Notice</Tabs.Tab>
                  <Tabs.Tab value="documents">Documents</Tabs.Tab>
                  <Tabs.Tab value="emails">Emails</Tabs.Tab>
                  <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
                  <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel label="Notice" value="notice">
                  <div className="flex flex-col">
                    <div className="flex flex justify-between m-4">
                      {uiConfigs.loadingContract === loadingStates.LOADING && (
                      <Badge size="xl" color="green">
                        <div className="flex items-center">
                          <CloudUpload size={20} />
                          <Text className="ml-2 lowercase">Saving...</Text>
                        </div>
                      </Badge>
                      )}
                      {(uiConfigs.loadingContract === loadingStates.NO_ACTIVE_REQUEST
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
                          )}
                      <div className="flex">
                        {uiConfigs.loadingContract !== loadingStates.LOADING && (
                        <>
                          <Button
                            color="cyan"
                            onClick={
                                    () => {
                                      saveNoticeContract(contractHtml);
                                    }
                                  }
                            disabled={uiConfigs.loadingContract === loadingStates.LOADING}
                            className="w-40 mx-4"
                          >
                            <Text>Save</Text>
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
                          <Editor
                            content={debouncedContractHtml}
                            onContentChange={setContractHtml}
                          />
                        </div>
                      ) : null}
                  </div>
                </Tabs.Panel>
                <Tabs.Panel label="Documents" value="documents">
                  <div className="p-6">
                    <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
                  </div>
                </Tabs.Panel>
                <Tabs.Panel label="Emails" value="emails">
                  <EmailTab parent="notice" parentId={noticeId} />
                </Tabs.Panel>
                <Tabs.Panel label="Tasks" value="tasks">
                  <TasksTab parent="notice" parentId={noticeId} />
                </Tabs.Panel>
                <Tabs.Panel label="Expenses" value="expenses">
                  <ExpensesTab parent="notice" parentId={noticeId} />
                </Tabs.Panel>
              </Tabs>
            </div>
            )}
      </div>
    </>
  );
};

export default NoticeDetailsPage;
