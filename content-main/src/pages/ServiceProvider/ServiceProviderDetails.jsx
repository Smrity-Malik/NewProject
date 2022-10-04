import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import {
  Skeleton, Text, Switch, Tabs, Center, Table, Badge, Anchor, Pagination, Modal,
} from '@mantine/core';
import {
  Calendar,
} from 'tabler-icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import smartTruncate from 'smart-truncate';
import {
  serviceProviderDetailsApi,
  serviceProviderExpensesApi,
  setSpStatus,
} from '../../utilities/apis/serviceProvider';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { formatDate, loadingStates } from '../../utilities/utilities';
import { openColors, themeColor } from '../../utilities/design';
import TextWithLabel from '../../components/TextWithLabel';
import DashboardTasks from '../DashboardTasks';
import UserAvatarView from '../../components/UserAvatarView';
import ExpenseDetail from '../../components/ExpenseDetail/ExpenseDetail';

const ServiceProviderDetails = () => {
  const [configs, setConfigs] = useState({
    details: null,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    expensesLoading: loadingStates.NO_ACTIVE_REQUEST,
    expensesPage: 1,
    expenses: null,
    editFormOpen: false,
    activeTab: 'tasks',
    totalExpensesCount: null,
    loadExpense: null,
  });

  const { serviceProviderId } = useParams();
  const navigate = useNavigate();
  const fetchServiceProviderDetails = async () => {
    if (!serviceProviderId) {
      navigate('/app');
      return;
    }
    if (configs.loading === loadingStates.LOADING) {
      return;
    }
    setConfigs((prevState) => ({
      ...prevState,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(serviceProviderDetailsApi({
      serviceProviderId,
    }));
    if (resp?.success && resp.serviceProvider) {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        details: resp.serviceProvider,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Service Providers',
        message: 'Cannot load service provider details.',
        color: 'red',
      });
    }
  };

  const fetchExpenses = async () => {
    setConfigs((prevState) => ({
      ...prevState,
      expensesLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(serviceProviderExpensesApi({
      serviceProviderId,
    }));
    if (resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        expenses: resp.expenses,
        expensesLoading: loadingStates.NO_ACTIVE_REQUEST,
        totalExpensesCount: resp.totalExpensesCount,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        expensesLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        message: "Couldn't load expenses",
        title: 'Expenses',
      });
    }
  };

  const changeSpStatus = async (enabled) => {
    const resp = await apiWrapWithErrorWithData(setSpStatus({
      enabled,
      serviceProviderId,
    }));
    if (!resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        details: {
          ...configs.details,
          enabled: !enabled,
        },
      }));
      showNotification({
        title: 'Service Provider',
        message: "Couldn't change service provider status",
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchServiceProviderDetails();
  }, []);

  useEffect(() => {
    if (configs.activeTab === 'expenses') {
      fetchExpenses();
    }
  }, [configs.activeTab]);

  return (
    <div className="flex flex-col p-4">
      {(configs.loadExpense !== null)
          && (
          <Modal
            overflow="inside"
            opened
            onClose={() => {
              setConfigs((prevState) => ({
                ...prevState,
                loadExpense: null,
              }));
            }}
            size="calc(80vw)"
          >
            <ExpenseDetail
              parent={configs.loadExpense.parent}
              parentId={configs.loadExpense.parentId}
              expenseId={configs.loadExpense.id}
              onModalExit={() => {
                setConfigs((prevState) => ({
                  ...prevState,
                  loadExpense: null,
                }));
              }}
            />
          </Modal>
          )}
      {configs.loading === loadingStates.LOADING && (
        <div className="flex flex-col">
          <Skeleton height={100} className="my-2" />
          <Skeleton height={100} className="my-2" />
          <Skeleton height={100} className="my-2" />
        </div>
      )}
      {configs.loading !== loadingStates.LOADING && configs.details && (
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <Text size="md">{configs.details.name}</Text>
              <div className="flex items-center mt-2">
                <Calendar />
                <Text
                  className="ml-2"
                  size="xs"
                  color="gray"
                >
                  {formatDate(configs.details.createdAt)}
                </Text>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col mr-4 items-center">
                <Switch
                  className="mr-4 cursor-pointer"
                  onChange={() => {
                    setConfigs((prevState) => ({
                      ...prevState,
                      details: {
                        ...prevState.details,
                        enabled: !prevState.details.enabled,
                      },
                    }));
                    changeSpStatus(!configs.details.enabled);
                  }}
                  checked={configs.details.enabled}
                />
                <Text
                  size="sm"
                  color={configs.details.enabled
                    ? themeColor(openColors.green[7])
                    : themeColor(openColors.red[4])}
                >
                  {configs.details.enabled ? 'Enabled' : 'Disabled'}
                </Text>
              </div>
              {/* <Button>Edit</Button> */}
            </div>
          </div>
          <div className="grid grid-cols-4 mt-12">
            <TextWithLabel text={configs.details.name} label="Name" />
            <TextWithLabel text={configs.details.email} label="Email" />
            <TextWithLabel text={configs.details.phone || '-'} label="Phone" />
            <TextWithLabel text={configs.details.designation || '-'} label="Designation" />
          </div>

          <Tabs
            className="mt-4"
            value={configs.activeTab}
            onTabChange={(tab) => {
              setConfigs((prevState) => ({
                ...prevState,
                activeTab: tab,
              }));
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
              <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="tasks" label="Tasks">
              {configs.activeTab === 'tasks'
                  && <DashboardTasks taskAssignedToUserId={serviceProviderId} />}
            </Tabs.Panel>
            <Tabs.Panel value="expenses" label="Expenses">
              {configs.expensesLoading === loadingStates.LOADING && (
              <div className="flex flex-col mb-2">
                <Skeleton height={100} radius="md" className="mt-1 mb-8 w-full" />
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
              {((configs.expensesLoading !== loadingStates.LOADING
                      && !configs.expenses?.length))
                  && <Center className="my-4">No expenses to show</Center>}
              {(configs.expensesLoading !== loadingStates.LOADING
                  && !!configs.expenses?.length) && (
                  <Table className="mt-8" striped>
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Paid on</th>
                        <th>Created by</th>
                        <th>Paid to</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {configs.expenses.map(
                        (row) => (
                          <tr key={row.id}>
                            <td>
                              <div className="flex flex-col">
                                <div>{`Expense - ${row.id}`}</div>
                                <Text size="xs" color="gray">{smartTruncate(row.purpose, 20)}</Text>
                              </div>
                            </td>
                            <td>
                              Rs.
                              {' '}
                              {row.amount}
                            </td>
                            <td>
                              {row.type.toLowerCase() === 'expense'
                                    && (
                                    <Badge color="orange">
                                      {row.type}
                                    </Badge>
                                    )}
                              {row.type.toLowerCase() === 'recovery'
                                    && (
                                    <Badge color="green">
                                      {row.type}
                                    </Badge>
                                    )}
                            </td>
                            <td>{formatDate(row.paidOn)}</td>
                            <td>
                              <UserAvatarView {...row.createdBy} />
                            </td>
                            <td>
                              {row.paidTo ? <UserAvatarView {...row.paidTo} /> : <span>-</span>}
                            </td>
                            <td>
                              <Anchor onClick={(e) => {
                                e.stopPropagation();
                                setConfigs((prevState) => ({
                                  ...prevState,
                                  loadExpense: row,
                                }));
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
              {Boolean(configs.totalExpensesCount)
                  && (
                  <div className="flex justify-center mt-4">
                    <Pagination
                      onChange={(page) => {
                        setConfigs((prevState) => ({
                          ...prevState,
                          expensesPage: page,
                        }));
                      }}
                      total={Math.ceil(configs.totalExpensesCount / 5)}
                      page={configs.expensesPage}
                    />
                  </div>
                  )}
            </Tabs.Panel>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDetails;
