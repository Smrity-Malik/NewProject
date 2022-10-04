import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import {
  ActionIcon, Button, Pagination, Table, Badge, Skeleton, Text, TextInput, Anchor, Select,
} from '@mantine/core';
import {
  Edit, Eye, Search, SortAscending,
} from 'tabler-icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { formatDate, getValueForInput, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getCasesList } from '../../utilities/apis/cases';
import { caseStatusColors } from '../../utilities/enums';
import CaseAnalytics from '../../components/CaseAnalytics/CaseAnalytics';
import DashboardNotifications from '../DashboardNotifications';
import colors, { themeColor } from '../../utilities/design';

const CaseListingPage = () => {
  const [listing, setListing] = useState({
    list: null,
    loaded: false,
    casesCount: null,
    filterOptions: {},
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchString: '',
  });
  const [debouncedSearchInput] = useDebouncedValue(listing.searchString, 500);
  const [configs, setConfigs] = useState({
    page: 1,
  });
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const sortOptions = [{
    label: 'Created',
    value: 'createdAt',
  }, {
    label: 'Status',
    value: 'status',
  }, {
    label: 'Next Date',
    value: 'nextDate',
  }];
  const fetchCaseList = async () => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getCasesList({
      page: configs.page,
      sortByOptions: {
        [listing.sortBy]: listing.sortDirection,
      },
      filterOptions: debouncedSearchInput?.length ? {
        OR: [
          {
            caseData: {
              path: '$.json.caseNumber.number',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.caseNumber.type',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.caseNumber.year',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.courtDetails.city',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.courtDetails.state',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.complainant[0].name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            caseData: {
              path: '$.json.respondent[0].name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            status: {
              contains: debouncedSearchInput,
            },
          },
          // {
          //   caseData: {
          //     path: '$.json.complainant[0].name',
          //     string_contains: debouncedSearchInput,
          //   },
          // },
          // {
          //   caseData: {
          //     path: '$.json.caseRecord.fixedFor',
          //     string_contains: debouncedSearchInput,
          //   },
          // },
        ],
      } : null,
    }));
    if (response?.success && response?.cases) {
      setListing((prevState) => ({
        ...prevState,
        list: response?.cases,
        loaded: true,
        casesCount: response?.casesCount,
      }));
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
  useEffect(() => {
    fetchCaseList();
  }, [
    configs.page, listing.sortBy, listing.sortDirection, debouncedSearchInput,
  ]);
  const data = listing?.list;
  // useEffect(() => {
  //   fetchCaseList();
  // }, []);
  const navigate = useNavigate();
  const onViewClick = (caseId) => {
    navigate(`/app/dispute-manager/cases/details/${caseId}`);
  };

  const onEditClick = (caseId) => {
    navigate('/app/dispute-manager/edit-case', {
      state: {
        caseId,
      },
    });
  };
  return (
    <>
      <div className="flex flex-col my-2">
        <Text>Case Notifications</Text>
        <DashboardNotifications
          onBtnClick={() => {
            navigate('/app/notifications', {
              state: {
                filterOptions: 'cases',
              },
            });
          }}
          filterOptions={{
            caseId: {
              not: null,
            },
          }}
        />
      </div>
      <div className="flex flex-row w-full">
        <CaseAnalytics />
      </div>
      <div className="flex justify-between items-center">
        <Text>Cases List</Text>
        <Button
          color={themeColor(colors.cases)}
          className="my-2 w-60"
          onClick={() => navigate('/app/dispute-manager/edit-case')}
        >
          Create New Case
        </Button>
      </div>
      {/* {uiConfigs.loading === loadingStates.LOADING */}
      {/*    && ( */}
      {/*    <div className="flex justify-between my-4"> */}
      {/*      <Skeleton height={40} radius="md" className="w-40" /> */}
      {/*      <Skeleton height={40} radius="md" className="w-40" /> */}
      {/*    </div> */}
      {/*    )} */}
      {/* {(uiConfigs.loading !== loadingStates.LOADING && listing.loaded && data) */}
      {/*    && ( */}
      {/*    <CaseFilterSortBar */}
      {/*      configs={configs} */}
      {/*      setConfigs={setConfigs} */}
      {/*    /> */}
      {/*    )} */}
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <Text size="xs" className="mb-2" color="gray">Case sensitive search</Text>
          <div className="flex items-center">
            <TextInput
              value={listing.searchString}
              onChange={(input) => {
                const val = getValueForInput(input);
                setListing((prevState) => ({
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
                setListing((prevState) => ({
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
            value={listing.sortBy}
            onChange={(val) => {
              setListing((prevState) => ({
                ...prevState,
                sortBy: val,
              }));
            }}
            data={sortOptions}
          />
          <ActionIcon
            onClick={() => {
              setListing((prevState) => ({
                ...prevState,
                sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc',
              }));
            }}
            color="blue"
            className={listing.sortDirection === 'asc' ? '' : 'rotate-180'}
          >
            <SortAscending />
          </ActionIcon>
        </div>
      </div>
      {uiConfigs.loading === loadingStates.LOADING
            && (
              <div className="flex flex-col">
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                <Skeleton height={30} radius="md" className="my-1 w-full" />
                {/* addd 5 rows */}
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
      {(uiConfigs.loading !== loadingStates.LOADING && listing.loaded && data)
        && (
        <div className="flex flex-col">
          <Table striped>
            <thead>
              <tr>
                <th>Reference No.</th>
                <th>Case No.</th>
                <th>Next Date</th>
                <th>Status</th>
                <th>Fixed For</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map(
                  (row) => (
                    <tr key={row.id}>
                      <td>
                        {`C - ${row.id}`}
                      </td>
                      <td>
                        {`${row.caseNumber.type} - ${row.caseNumber.number} / ${row.caseNumber.year} `}
                      </td>
                      <td>
                        {(formatDate(row.caseRecord?.nextHearing))}
                      </td>
                      <td>
                        <Badge color={caseStatusColors[row.status] || 'orange'}>
                          {row.status}
                        </Badge>
                      </td>
                      <td>
                        {row.caseRecord?.fixedFor}
                      </td>
                      <td>
                        <div className="flex flex-row">
                          <ActionIcon
                            onClick={() => {
                              onEditClick(row.id);
                            }}
                            color="white"
                          >
                            <Edit size={24} />
                          </ActionIcon>
                          {row.formCompleted
                              && (
                              <ActionIcon
                                // className="mx-2"
                                onClick={() => {
                                  onViewClick(row.id);
                                }}
                                color="white"
                              >
                                <Eye size={24} />
                              </ActionIcon>
                              )}
                        </div>
                      </td>
                    </tr>
                  ),
                )
              }
            </tbody>
          </Table>
          {listing.casesCount
          && (
          <div className="flex flex-row justify-center my-4">
            <Pagination
              page={configs.page}
              onChange={((page) => {
                setConfigs({
                  ...configs,
                  page,
                });
              })}
              total={Math.ceil(listing.casesCount / 10)}
            />
          </div>
          )}
        </div>
        )}
    </>
  );
};

export default CaseListingPage;
