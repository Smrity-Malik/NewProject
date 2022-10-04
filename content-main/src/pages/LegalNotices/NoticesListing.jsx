/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  ActionIcon, Badge, Pagination, Skeleton, Table, Tabs, Text, Button, TextInput, Anchor, Select,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Edit, Eye, Search, SortAscending } from 'tabler-icons-react';
import DashboardNotifications from '../DashboardNotifications';
import NoticesAnalytics from '../../components/NoticesAnalytics/NoticesAnalytics';
import { formatDate, getValueForInput, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { listNoticeRequests, listNotices } from '../../utilities/apis/notices';
import { noticeRequestStatusColors, noticeStatusColors } from '../../utilities/enums';
import UserAvatarView from '../../components/UserAvatarView';
import NoticeRequestView from './NoticeRequestView';
import colors, { themeColor } from '../../utilities/design';
import { useDebouncedValue } from '@mantine/hooks';

const NoticesListing = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState({
    activeTab: 'notices',
    noticeListPage: 1,
    notices: null,
    noticesCount: null,
    noticeRequestsCount: null,
    noticeRequests: null,
    noticeRequestListPage: 1,
    noticesLoading: loadingStates.NO_ACTIVE_REQUEST,
    noticeRequestsLoading: loadingStates.NO_ACTIVE_REQUEST,
    loadNoticeRequest: null,
    filterOptions: {},
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchString: '',
  });

  const fetchNotices = async () => {
    setConfigs((stateC) => ({
      ...stateC,
      noticesLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(listNotices({
      page: configs.noticeListPage,
      sortByOptions: {
        [configs.sortBy]: configs.sortDirection,
      },
      filterOptions: debouncedSearchInput?.length ? {
        OR: [
          {
            noticeData: {
              path: '$.json.noticePurpose',
              string_contains: debouncedSearchInput,
            },
          },
          {
            noticeData: {
              path: '$.json.noticeSubPurpose',
              string_contains: debouncedSearchInput,
            },
          },
          {
            noticeData: {
              path: '$.json.senders[0].name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            noticeData: {
              path: '$.json.receivers[0].name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            status: {
              contains: debouncedSearchInput,
            },
          },
        ],
      } : null,
    }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        notices: resp.notices,
        noticesCount: resp.noticesCount,
        noticesLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      setConfigs((stateC) => ({
        ...stateC,
        noticesLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        title: 'Notices List',
        message: "Couldn't load notices list",
      });
    }
  };

  const [debouncedSearchInput] = useDebouncedValue(configs.searchString, 500);

  const fetchNoticeRequests = async () => {
    setConfigs((stateC) => ({
      ...stateC,
      noticeRequestsLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(listNoticeRequests({
      page: configs.noticeRequestListPage,
    }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        noticeRequests: resp.noticeRequests,
        noticeRequestsCount: resp.noticeRequestsCount,
        noticeRequestsLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      setConfigs((stateC) => ({
        ...stateC,
        noticeRequestsLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        title: 'Notice Requests List',
        message: "Couldn't load notice requests list",
      });
    }
  };

  useEffect(() => {
    fetchNotices();
  },
  [configs.noticeListPage, debouncedSearchInput, configs.sortDirection, configs.sortBy]);

  useEffect(() => {
    fetchNoticeRequests();
  },
  [configs.noticeRequestListPage]);

  const sortOptions = [{
    label: 'Created',
    value: 'createdAt',
  }, {
    label: 'Status',
    value: 'status',
  }];

  return (
    <div className="flex flex-col">
      {!!configs.loadNoticeRequest && <NoticeRequestView
          onClose={() => {
            setConfigs((stateC) => ({
              ...stateC,
              loadNoticeRequest: null,
            }))
          }}
          noticeRequestId={configs.loadNoticeRequest} />}
      <div className="flex flex-col my-2">
        <Text>Notices Notifications</Text>
        <DashboardNotifications
          onBtnClick={() => {
            navigate('/app/notifications', {
              state: {
                filterOptions: 'notices',
              },
            });
          }}
          filterOptions={{
            noticeId: {
              not: null,
            },
          }}
        />
      </div>
      <div className="flex flex-row w-full">
        <NoticesAnalytics />
      </div>
      <div className="flex flex-col my-2 mb-40">
        <div className="flex justify-end my-2">
          <Button
              color={themeColor(colors.notices)}
              onClick={() => {
            navigate('/app/dispute-manager/legal-notices/create')
          }}>Create New Notice</Button>
        </div>
        <Tabs
          value={configs.activeTab}
          onTabChange={(tab) => {
            setConfigs((stateC) => ({
              ...stateC,
              activeTab: tab,
            }));
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="notices">Notices</Tabs.Tab>
            <Tabs.Tab value="notice-requests">Notice Requests</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel label="Notices" value="notices">
            <div className="flex w-full justify-between items-center mt-2">
              <div className="flex flex-col">
                <Text size="xs" className="mb-2" color="gray">Case sensitive search</Text>
                <div className="flex items-center">
                  <TextInput
                      value={configs.searchString}
                      onChange={(input) => {
                        const val = getValueForInput(input);
                        setConfigs((prevState) => ({
                          ...prevState,
                          searchString: val,
                        }));
                      }}
                      placeholder="Type to search..."
                      icon={<Search size={14} />}
                  />
                  <Anchor
                      className="ml-2"
                      onClick={() => {
                        setConfigs((prevState) => ({
                          ...prevState,
                          searchString: '',
                        }));
                      }}
                  >
                    Clear
                  </Anchor>
                </div>
              </div>
              <div className="flex items-center">
                Sort:
                <Select
                    className="mx-2"
                    value={configs.sortBy}
                    onChange={(val) => {
                      setConfigs((prevState) => ({
                        ...prevState,
                        sortBy: val,
                      }));
                    }}
                    data={sortOptions}
                />
                <ActionIcon
                    onClick={() => {
                      setConfigs((prevState) => ({
                        ...prevState,
                        sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                    color="blue"
                    className={configs.sortDirection === 'asc' ? '' : 'rotate-180'}
                >
                  <SortAscending />
                </ActionIcon>
              </div>
            </div>
            {configs.noticesLoading === loadingStates.LOADING
                && (
                    <div className="flex flex-col my-4">
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
                      <Skeleton height={30} radius="md" className="my-1 w-full" />
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
            {(configs.noticesLoading !== loadingStates.LOADING && configs.notices)
                && (
                    <div className="flex flex-col my-4">
                      <Table striped>
                        <thead>
                        <tr>
                          <th>Reference No.</th>
                          <th>Created By</th>
                          <th>Created Date</th>
                          <th>Status</th>
                          <th>&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          configs.notices.map(
                              (row) => (
                                  <tr key={row.id}>
                                    <td>
                                      {`Notice - ${row.id}`}
                                    </td>
                                    <td>
                                      <UserAvatarView {...row.createdBy} />
                                    </td>
                                    <td>
                                      {(formatDate(row.createdAt))}
                                    </td>
                                    <td>
                                      <Badge color={noticeStatusColors[row.status] || 'orange'}>
                                        {row.status}
                                      </Badge>
                                    </td>

                                    <td>
                                      <div className="flex flex-row">
                                      <ActionIcon
                                            onClick={() => {
                                              navigate('/app/dispute-manager/legal-notices/edit/', {
                                                state: {
                                                  noticeId: row.id
                                                }
                                              })
                                            }}
                                            color="white"
                                        >
                                          <Edit size={24} />
                                        </ActionIcon>
                                        {row.noticeData?.json?.formCompleted &&
                                            <ActionIcon
                                                onClick={() => {
                                                  navigate(`/app/dispute-manager/legal-notices/details/${row.id}`, {
                                                    state: {
                                                      noticeId: row.id
                                                    }
                                                  })
                                                }}
                                                color="white"
                                            >
                                              <Eye size={24}/>
                                            </ActionIcon>
                                        }
                                        {/* {row.noticeData?.json?.formCompleted &&
                                            <ActionIcon
                                                onClick={() => {
                                                  navigate(`/app/dispute-manager/legal-notices/details/${row.id}`, {
                                                    state: {
                                                      noticeId: row.id
                                                    }
                                                  })
                                                }}
                                                color="white"
                                            >
                                              <Eye size={24}/>
                                            </ActionIcon>
                                        }
                                        <ActionIcon
                                            onClick={() => {
                                              navigate('/app/dispute-manager/legal-notices/edit/', {
                                                state: {
                                                  noticeId: row.id
                                                }
                                              })
                                            }}
                                            color="white"
                                        >
                                          <Edit size={24} />
                                        </ActionIcon> */}
                                      </div>
                                    </td>
                                  </tr>
                              ),
                          )
                        }
                        </tbody>
                      </Table>
                      {!!(configs.noticesCount)
                          && (
                              <div className="flex flex-row justify-center my-4">
                                <Pagination
                                    page={configs.noticeRequestListPage}
                                    onChange={((page) => {
                                      setConfigs({
                                        ...configs,
                                        noticeRequestListPage: page,
                                      });
                                    })}
                                    total={Math.ceil(configs.noticeRequestsCount / 10)}
                                />
                              </div>
                          )}
                    </div>
                )}
          </Tabs.Panel>

          <Tabs.Panel label="Notice Requests" value="notice-requests">
            {configs.noticeRequestsLoading === loadingStates.LOADING
                && (
                <div className="flex flex-col my-4">
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
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
            {(configs.noticeRequestsLoading !== loadingStates.LOADING && configs.noticeRequests)
                && (
                <div className="flex flex-col my-4">
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Reference No.</th>
                        <th>Requested By</th>
                        <th>Requested Date</th>
                        <th>Status</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        configs.noticeRequests.map(
                          (row) => (
                            <tr key={row.id}>
                              <td>
                                {`NR - ${row.id}`}
                              </td>
                              <td>
                                {row.requestedByEmail}
                              </td>
                              <td>
                                {(formatDate(row.requestedAt))}
                              </td>
                              <td>
                                <Badge color={noticeRequestStatusColors[row.status] || 'orange'}>
                                  {row.status}
                                </Badge>
                              </td>

                              <td>
                                <div className="flex flex-row">
                                  <ActionIcon
                                    onClick={() => {
                                      setConfigs((stateC) => ({
                                        ...stateC,
                                        loadNoticeRequest: row.id,
                                      }));
                                    }}
                                    color="white"
                                  >
                                    <Eye size={24} />
                                  </ActionIcon>
                                </div>
                              </td>
                            </tr>
                          ),
                        )
                        }
                    </tbody>
                  </Table>
                  {configs.noticeRequestsCount
                          && (
                          <div className="flex flex-row justify-center my-4">
                            <Pagination
                              page={configs.noticeRequestListPage}
                              onChange={((page) => {
                                setConfigs({
                                  ...configs,
                                  noticeRequestListPage: page,
                                });
                              })}
                              total={Math.ceil(configs.noticeRequestsCount / 10)}
                            />
                          </div>
                          )}
                </div>
                )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default NoticesListing;
