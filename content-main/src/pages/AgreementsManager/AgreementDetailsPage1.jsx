/* eslint-disable max-len */
import React, { createRef, useEffect, useState } from 'react';
import {
  Anchor, Button, Table, Tabs, Text,
} from '@mantine/core';
import { addDays, parseISO } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { Settings, Paperclip } from 'tabler-icons-react';
import flat from 'flat';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledDocument from '@ckeditor/ckeditor5-build-decoupled-document';
// import ExportPdf from '@ckeditor/ckeditor5-export-pdf/src/exportpdf';
// import CloudServices from '@ckeditor/ckeditor5-cloud-services/build/cloud-services';
import { useDebouncedValue } from '@mantine/hooks';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
// import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import TextWithLabel from '../../components/TextWithLabel';
import { cleanFileObj, formatDate, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import colors from '../../utilities/design';
import { getResourceTasks } from '../../utilities/apis/tasks';
import TaskModal from '../../components/TaskModal';
import { getResourceFinances } from '../../utilities/apis/financials';
import FinancialModal from '../../components/FinancialModal';
import { createSigningRequest, getAgreementDetails, updateAgreement } from '../../utilities/apis/agreements';
import DocumentUploader from '../DocumentUploader/DocumentUploader';

const AgreementDetailsPage = () => {
  const { agreementId } = useParams();
  const [files, setFiles] = useState([]);
  const [agreementData, setAgreementData] = useState({
    loaded: false,
    agreementId: agreementId || null,
    data: null,
  });
  const data = agreementData.data?.json;
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    activeTab: 0,
    filesLoading: loadingStates.NO_ACTIVE_REQUEST,
    loadingContract: loadingStates.NO_ACTIVE_REQUEST,
  });

  const [contractHtml, setContractHtml] = useState(null);

  const fetchAgreementData = async (agreementIdIncoming) => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getAgreementDetails(
      { agreementId: agreementIdIncoming },
    ));
    if (response?.success && response?.agreementData) {
      setAgreementData({
        ...agreementData,
        data: response?.agreementData,
        loaded: true,
      });
      setFiles(((response?.agreementData?.json?.documents || []).map((file) => ({
        ...file,
        uploadStarted: true,
        uploadedComplete: true,
      }))));
      setContractHtml((response?.agreementData?.json?.contractHtml) || '<p>Agreement information goes here.</p>');
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

  const [tasksConfig, setTasksConfig] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    tasks: [],
  });
  const getTasks = async () => {
    setTasksConfig({
      ...tasksConfig,
      loadingStates: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getResourceTasks({
      parentResource: 'agreement',
      parentResourceId: agreementData.agreementId,
    }));
    if (response?.success && response?.tasks) {
      setTasksConfig({
        ...tasksConfig,
        tasks: response.tasks,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Tasks',
        message: `Failed to load tasks for notice ${agreementData.agreementId}`,
      });
      setTasksConfig({
        ...tasksConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  const [financialsConfig, setFinancialsConfig] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    financials: [],
  });
  const getFinancials = async () => {
    setFinancialsConfig({
      ...financialsConfig,
      loadingStates: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getResourceFinances({
      parentResource: 'agreement',
      parentResourceId: agreementData.agreementId,
    }));
    if (response?.success && response?.records) {
      setFinancialsConfig({
        ...financialsConfig,
        financials: response.records,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Tasks',
        message: `Failed to load tasks for agreement ${agreementData.agreementId}`,
      });
      setFinancialsConfig({
        ...financialsConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  useEffect(() => {
    getTasks();
    getFinancials();
  }, []);

  const toolBarRef = createRef();

  const navigate = useNavigate();

  const saveFilesIntoAgreement = async () => {
    const cleaned = files.map(cleanFileObj);
    const agreementDataJSON = { ...agreementData.data?.json };
    agreementDataJSON.documents = cleaned;
    setUiConfigs({
      ...uiConfigs,
      filesLoading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(updateAgreement({
      agreementId,
      agreementData: {
        json: agreementDataJSON,
        flatted: flat(agreementDataJSON),
      },
    }));
    if (response && response?.success) {
      showNotification({
        color: 'green',
        title: 'Agreement',
        message: 'Agreement saved successfully.',
      });
      fetchAgreementData(agreementData.agreementId);
    } else {
      showNotification({
        color: 'red',
        title: 'Agreement',
        message: 'Failed to save agreement.',
      });
    }
    setUiConfigs({
      ...uiConfigs,
      filesLoading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };
  const [debouncedContractHtml] = useDebouncedValue(contractHtml, 1000, { leading: true });
  const saveAgreementContract = async (html) => {
    if (!data) {
      return;
    }
    setUiConfigs({
      ...uiConfigs,
      loadingContract: loadingStates.LOADING,
    });
    const agreementResp = await apiWrapWithErrorWithData(updateAgreement({
      agreementId,
      agreementData: ({
        ...agreementData.data,
        flatted: {
          ...agreementData.data.flatted,
          contractHtml: html,
        },
        json: {
          ...agreementData.data.json,
          contractHtml: html,
        },
      }),
    }));
    if (agreementResp && agreementResp.success) {
      setUiConfigs({
        ...uiConfigs,
        loadingContract: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      setUiConfigs({
        ...uiConfigs,
        loadingContract: loadingStates.NO_ACTIVE_REQUEST,
      });
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
  return (
    <>
      <div className="flex flex-col">
        {uiConfigs.loading === loadingStates.LOADING
                    && <BeatLoader color={colors.primary} size={10} />}
      </div>
      {(agreementData.loaded && data)
                && (
                <div className="flex flex-col">
                  <Text size="md" color="#46BDE1" className="mt-4">Contract Details</Text>
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
                    </div>
                    <div className="flex flex-row">
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
                    </div>
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
                  </div>

                  <Tabs
                    active={uiConfigs.activeTab}
                    onTabChange={(tab) => {
                      setUiConfigs({
                        ...uiConfigs,
                        activeTab: tab,
                      });
                    }}
                  >
                    <Tabs.Tab label="Contract" icon={<Paperclip size={14} />}>
                      <div className="flex flex-col">
                        {uiConfigs.loadingContract === loadingStates.LOADING ? <BeatLoader size={10} color={colors.primary} />
                          : (
                            <div className="flex flex-col m-4">
                              <Button className="w-40">Save Contract</Button>
                              <Text>Saved automatically every 2 seconds.</Text>
                            </div>
                          )}
                        {(debouncedContractHtml)
                          ? (
                            <div className="flex flex-col">
                              <div ref={toolBarRef} />
                              <CKEditor
                                config={{
                                  // plugins: [Bold],
                                  cloudServices: {
                                    tokenUrl: 'https://90286.cke-cs.com/token/dev/e9ff0bb35ca204fbf9975bcc54f7dd1273cfafb50b83f44883ffc343dfd5?limit=10',
                                    uploadUrl: 'https://90286.cke-cs.com/easyimage/upload/',
                                  },
                                  // toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', '|', 'fontFamily', '|', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable', '|', 'undo', 'redo'],
                                  // toolbar: ['bold'],
                                }}
                                // onInit={(editor) => {
                                //   // Add the toolbar to the container
                                //   const toolbarContainer = document.querySelector('#toolbar-container');
                                //   toolbarContainer.appendChild(editor.ui.view.toolbar.element);
                                //
                                //   window.editor = editor;
                                //   // You can store the "editor" and use when it is needed.
                                //   // console.log('Editor is ready to use!', editor);
                                // }}
                                editor={DecoupledDocument}
                                data={debouncedContractHtml}
                                onReady={(editor) => {
                                  if (toolBarRef.current) {
                                    toolBarRef.current.appendChild(editor.ui.view.toolbar.element);
                                  }
                                }}
                                onChange={(event, editor) => {
                                  const dataEditor = editor.getData();
                                  setContractHtml(dataEditor);
                                  // console.log({ event, editor, dataEditor });
                                }}
                              />
                            </div>
                          ) : null}
                      </div>
                    </Tabs.Tab>
                    <Tabs.Tab label="Documents" icon={<Settings size={14} />}>
                      <div className="flex flex-col">
                        <Text className="mb-4">Documents</Text>
                        <DocumentUploader parentResource="agreement" parentResourceId={agreementId} files={files} setFiles={setFiles} />
                        {uiConfigs.filesLoading !== loadingStates.LOADING && (
                        <Button
                          className="w-24"
                          onClick={saveFilesIntoAgreement}
                        >
                          Save
                        </Button>
                        )}
                        {uiConfigs.filesLoading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                      </div>
                    </Tabs.Tab>
                    <Tabs.Tab label="Signature" icon={<Settings size={14} />}>
                      {(data?.firstParty?.email?.length && data?.secondParty?.email?.length)

                        ? (
                          <div className="flex flex-col">
                            <Text size="sm">
                              Signature request will be sent to
                              {' '}
                              <b>{data?.firstParty?.email}</b>
                              {' '}
                              and
                              {' '}
                              <b>{data?.secondParty?.email}</b>
                            </Text>
                            <Text size="sm" className="mt-4">A demo file will be sent on the above mentioned email for signing demo.</Text>
                            <Button
                              className="w-64 mt-4"
                              onClick={async () => {
                                const resp = await apiWrapWithErrorWithData(createSigningRequest([data?.firstParty?.email, data?.secondParty?.email]));
                                if (resp) {
                                  alert('SignatureRequest request sent to emails.');
                                } else {
                                  alert('SignatureRequest request failed.');
                                }
                              }}
                            >
                              Send Sign Demo
                            </Button>
                          </div>
                        )
                        : <div>First party and second party email not found.</div>}
                    </Tabs.Tab>
                    <Tabs.Tab label="Tasks">
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between">
                          <div>
                            {tasksConfig.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                            {((tasksConfig.loading !== loadingStates.LOADING && !tasksConfig.tasks?.length))
                                                && <div>No tasks to show</div>}
                            {(tasksConfig.loading !== loadingStates.LOADING && !!tasksConfig.tasks.length) && (
                            <Table striped>
                              <thead>
                                <tr>
                                  <th>Created At</th>
                                  <th>Created By</th>
                                  <th>Assigned To</th>
                                  <th>Status</th>
                                  <th>Due Date</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tasksConfig.tasks.map(
                                  (row) => (
                                    <tr key={row.id}>
                                      <td>{formatDate(parseISO(row.createdAt))}</td>
                                      <td>{row.createdBy}</td>
                                      <td>{row.assignedToEmail}</td>
                                      <td>{row.status}</td>
                                      <td>{row.dueDate ? formatDate(parseISO(row.dueDate)) : '-'}</td>
                                      <td>
                                        <TaskModal
                                          taskToLoad={row.id}
                                          mode="view"
                                          componentToShow={<Anchor>View</Anchor>}
                                        />
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </Table>
                            )}
                          </div>
                          <div>
                            <TaskModal
                              parentResource="agreement"
                              parentResourceId={agreementData.agreementId}
                              refreshParent={getTasks}
                              componentToShow={<Button>Create Task</Button>}
                              mode="edit"
                            />
                          </div>
                        </div>
                      </div>
                    </Tabs.Tab>
                    <Tabs.Tab label="Expenses">
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between">
                          <div>
                            {financialsConfig.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                            {financialsConfig.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                            {((financialsConfig.loading !== loadingStates.LOADING && !financialsConfig.financials?.length))
                                                && <div>No entries to show</div>}
                            {(financialsConfig.loading !== loadingStates.LOADING && !!financialsConfig.financials.length) && (
                            <Table striped>
                              <thead>
                                <tr>
                                  <th>Amount</th>
                                  <th>Purpose</th>
                                  <th>Type</th>
                                  <th>Date</th>
                                  <th>Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {financialsConfig.financials.map(
                                  (row) => (
                                    <tr key={row.id}>
                                      <td>{row.amount}</td>
                                      <td>{row.purpose}</td>
                                      <td>{row.type}</td>
                                      <td>{formatDate(parseISO(row.date))}</td>
                                      <td>
                                        <FinancialModal
                                          toLoad={row}
                                          parentResource="agreement"
                                          parentResourceId={agreementData.agreementId}
                                          refreshParent={getFinancials}
                                          componentToShow={<Anchor>View</Anchor>}
                                          mode="view"
                                        />
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </Table>
                            )}
                          </div>
                          <div>
                            <FinancialModal
                              parentResource="agreement"
                              parentResourceId={agreementData.agreementId}
                              refreshParent={getFinancials}
                              componentToShow={<Button>Create Entry</Button>}
                              mode="edit"
                            />
                          </div>
                        </div>
                      </div>
                    </Tabs.Tab>
                  </Tabs>

                </div>
                )}
    </>
  );
};

export default AgreementDetailsPage;
