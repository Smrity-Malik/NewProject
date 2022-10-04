/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Skeleton,
  Tabs,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getCaseDetails } from '../../utilities/apis/cases';
import CaseAdditionalSettings from './CaseAdditionalSettings';
import CaseDetails from '../../components/CaseDetails/CaseDetails';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';
import TasksTab from '../../components/TasksTab/TasksTab';
import ExpensesTab from '../../components/ExpensesTab/ExpensesTab';
import CaseRecordTab from '../../components/CaseRecordTab/CaseRecordTab';
// import PopperHandler from '../../components/PopperHandler';

const CaseDetailsPage = () => {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState({
    loaded: false,
    wholeData: null,
    caseId: caseId || null,
    data: null,
  });
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    activeTab: 'details',
    additionalSettingsOpened: false,
    additionalSettingsLoading: loadingStates.NO_ACTIVE_REQUEST,
    taskPage: 1,
  });

  const fetchCaseData = async (caseIdIncoming) => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getCaseDetails({ caseId: caseIdIncoming }));
    if (response?.success && response?.case?.caseData) {
      setCaseData({
        ...caseData,
        data: response?.case?.caseData,
        wholeData: response.case,
        loaded: true,
      });
    } else {
      showNotification(({
        color: 'red',
        title: 'Case',
        message: 'Something went wrong.',
      }));
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };
  const data = { ...caseData.data?.json, createdAt: '2022-08-06T06:45:05Z', amount: '200000' };
  useEffect(() => {
    if (caseData.caseId) {
      fetchCaseData(caseData.caseId);
    } else {
      showNotification(({
        color: 'red',
        title: 'Case',
        message: 'No caseId found',
      }));
    }
  }, [caseData.caseId, uiConfigs.additionalSettingsOpened]);

  const multiUploadArgs = useMultiFileUpload({ loadFromParent: true, parentId: caseId, parent: 'case' });
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
      {(caseData.loaded && data)
        && (
        <div className="pb-40">
          <CaseDetails
            onEditClick={() => {
              setUiConfigs({
                ...uiConfigs,
                additionalSettingsOpened: true,
              });
            }}
            nextDate={caseData.wholeData.nextDate}
            caseData={{
              ...data,
              createdBy: caseData.wholeData.createdBy,
              status: caseData.wholeData.status,
              amount: caseData.wholeData.amount,
            }}
            caseId={caseId}
            upperHalf
          />
          <Tabs
            value={uiConfigs.activeTab}
            onTabChange={(tab) => {
              setUiConfigs({
                ...uiConfigs,
                activeTab: tab,
              });
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="details">Details</Tabs.Tab>
              <Tabs.Tab value="documents">Documents</Tabs.Tab>
              <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
              <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
              <Tabs.Tab value="case-records">Case Records</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel label="Details" value="details">
              <CaseDetails
                nextDate={caseData.wholeData.nextDate}
                caseData={{ ...data, createdBy: caseData.wholeData.createdBy }}
                caseId={caseId}
                lowerHalf
              />
            </Tabs.Panel>
            <Tabs.Panel label="Documents" value="documents">
              <div className="p-6">
                <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel label="Tasks" value="tasks">
              <TasksTab parent="case" parentId={caseData.caseId} />
            </Tabs.Panel>
            <Tabs.Panel label="Expenses" value="expenses">
              <ExpensesTab parentId={caseId} parent="case" />
            </Tabs.Panel>
            <Tabs.Panel label="Case Records" value="case-records">
              <CaseRecordTab parentId={caseId} parent="case" />
            </Tabs.Panel>
          </Tabs>
          {uiConfigs.additionalSettingsOpened
              && (
              <CaseAdditionalSettings
                caseId={caseId}
                setCaseData={setCaseData}
                caseData={caseData}
                uiConfigs={uiConfigs}
                setUiConfigs={setUiConfigs}
                onClose={() => {
                  setUiConfigs({
                    ...uiConfigs,
                    additionalSettingsOpened: false,
                  });
                }}
              />
              )}
        </div>
        )}
    </>
  );
};

export default CaseDetailsPage;
