import React, { useEffect, useState } from 'react';
import {
  ActionIcon, Anchor, Button, Center, Modal, Skeleton, Table, Pagination, Text,
} from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import smartTruncate from 'smart-truncate';
import { formatDate, loadingStates } from '../../utilities/utilities';
import UserAvatarView from '../UserAvatarView';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { listCaseRecords } from '../../utilities/apis/cases';
import CaseRecordForm from '../CaseRecordForm/CaseRecordForm';
import CaseRecordDetail from '../CaseRecordDetail/CaseRecordDetail';

const CaseRecordTab = ({ parent, parentId }) => {
  const [caseRecordsConfig, setCaseRecordsConfig] = useState({
    caseRecordFormVisible: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    caseRecords: [],
    page: 1,
    caseRecordsCount: null,
    loadCaseRecord: null,
  });

  const getRecords = async () => {
    setCaseRecordsConfig((caseRecordC) => ({
      ...caseRecordC,
      loading: loadingStates.LOADING,
      caseRecordsCount: null,
    }));
    const response = await apiWrapWithErrorWithData(
      listCaseRecords({
        caseId: parentId,
        page: caseRecordsConfig.page,
      }),
    );
    if (response?.success && response?.caseRecords) {
      setCaseRecordsConfig({
        ...caseRecordsConfig,
        caseRecords: response.caseRecords,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        caseRecordsCount: response.caseRecordsCount || null,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Case records',
        message: `Failed to load records for ${parent} ${parentId}`,
      });
      setCaseRecordsConfig({
        ...caseRecordsConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  useEffect(() => {
    if (caseRecordsConfig.loadCaseRecord === null || !caseRecordsConfig.caseRecordFormVisible) {
      getRecords();
    }
  }, [caseRecordsConfig.loadTask, caseRecordsConfig.caseRecordFormVisible]);

  return (
    <>
      {caseRecordsConfig.caseRecordFormVisible
                && (
                <Modal
                  closeOnClickOutside={false}
                  overflow="inside"
                  opened
                  onClose={() => {
                    setCaseRecordsConfig({
                      ...caseRecordsConfig,
                      caseRecordFormVisible: false,
                    });
                  }}
                  size="calc(80vw)"
                >
                  <CaseRecordForm
                    parent={parent}
                    parentId={parentId}
                    onModalExit={() => {
                      setCaseRecordsConfig({
                        ...caseRecordsConfig,
                        caseRecordFormVisible: false,
                      });
                    }}
                  />
                </Modal>
                )}

      {(caseRecordsConfig.loadCaseRecord !== null)
                && (
                <Modal
                  overflow="inside"
                  opened
                  onClose={() => {
                    setCaseRecordsConfig({
                      ...caseRecordsConfig,
                      loadCaseRecord: null,
                    });
                  }}
                  size="calc(80vw)"
                >
                  <CaseRecordDetail
                    parent={parent}
                    parentId={parentId}
                    recordId={caseRecordsConfig.loadCaseRecord}
                    onModalExit={() => {
                      setCaseRecordsConfig({
                        ...caseRecordsConfig,
                        loadCaseRecord: null,
                      });
                    }}
                  />
                </Modal>
                )}
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-end">
          <div className="flex items-center">
            <ActionIcon color="white" className="mx-2" onClick={getRecords}>
              <Refresh />
            </ActionIcon>
            <Button
              onClick={() => setCaseRecordsConfig({
                ...caseRecordsConfig,
                caseRecordFormVisible: true,
              })}
              className="w-40 mx-2"
            >
              Create Record
            </Button>
          </div>
        </div>
        {caseRecordsConfig.loading === loadingStates.LOADING
                    && (
                    <div className="flex flex-col mb-2">
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <div className="flex flex-row justify-center">
                        <Skeleton height={40} radius="md" className="w-40" />
                      </div>
                    </div>
                    )}
        {((caseRecordsConfig.loading !== loadingStates.LOADING
                && !caseRecordsConfig.caseRecords?.length))
                    && <Center className="my-4">No case records to show</Center>}
        {(caseRecordsConfig.loading !== loadingStates.LOADING
            && !!caseRecordsConfig.caseRecords.length) && (
            <Table className="mt-8" striped>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Hearing Date</th>
                  <th>Fixed for</th>
                  <th>Next Date</th>
                  <th>Created by</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {caseRecordsConfig.caseRecords.map(
                  (row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="flex flex-col">
                          <div>{`Record - ${row.id}`}</div>
                          <Text size="xs" color="gray">{smartTruncate(row.purpose, 20)}</Text>
                        </div>
                      </td>
                      <td>
                        {formatDate(row.caseDate)}
                      </td>
                      <td>
                        {row.fixedFor}
                      </td>
                      <td>{formatDate(row.nextHearing)}</td>
                      <td>
                        <UserAvatarView {...row.createdBy} />
                      </td>
                      <td>
                        <Anchor onClick={(e) => {
                          e.stopPropagation();
                          setCaseRecordsConfig({
                            ...caseRecordsConfig,
                            loadCaseRecord: row.id,
                          });
                        }}
                        >
                          View
                        </Anchor>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
        )}
        {caseRecordsConfig.caseRecordsCount
                    && (
                    <div className="flex justify-center mt-4">
                      <Pagination
                        onChange={(page) => {
                          setCaseRecordsConfig({
                            ...caseRecordsConfig,
                            page,
                          });
                        }}
                        total={Math.ceil(caseRecordsConfig.caseRecordsCount / 5)}
                        page={caseRecordsConfig.page}
                      />
                    </div>
                    )}
      </div>
    </>
  );
};

export default CaseRecordTab;
