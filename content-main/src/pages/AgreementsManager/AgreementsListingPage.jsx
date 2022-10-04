import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import {
  ActionIcon, Badge, Button, Pagination, Select, Skeleton, Table, Text, TextInput, Anchor,
} from '@mantine/core';
import {
  Edit, Eye, Search, SortAscending,
} from 'tabler-icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { getValueForInput, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getAgreementsList } from '../../utilities/apis/agreements';
import UserAvatarView from '../../components/UserAvatarView';
import DashboardNotifications from '../DashboardNotifications';
import { agreementStatusColors } from '../../utilities/enums';
import AgreementAnalytics from '../../components/AgreementAnalytics/AgreementAnalytics';
import colors, { themeColor } from '../../utilities/design';

const AgreementsListingPage = () => {
  const [listing, setListing] = useState({
    list: null,
    loaded: false,
    filterOptions: {},
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchString: '',
  });
  const [uiConfigs, setUiConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    page: 1,
  });
  const [debouncedSearchInput] = useDebouncedValue(listing.searchString, 500);
  const fetchAgreementsList = async () => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getAgreementsList({
      page: uiConfigs.page,
      sortByOptions: {
        [listing.sortBy]: listing.sortDirection,
      },
      filterOptions: debouncedSearchInput?.length ? {
        OR: [
          {
            firstParty: {
              path: '$.name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            secondParty: {
              path: '$.name',
              string_contains: debouncedSearchInput,
            },
          },
          {
            typeOfAgreement: {
              contains: debouncedSearchInput,
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
    if (response?.success && response?.agreements) {
      setListing({
        ...listing,
        list: response?.agreements,
        agreementsCount: response.agreementsCount,
        loaded: true,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Agreements',
        message: 'Something went wrong.',
      });
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };
  const data = listing?.list;
  useEffect(() => {
    fetchAgreementsList({});
  }, [uiConfigs.page, listing.sortBy, listing.sortDirection, debouncedSearchInput]);
  const navigate = useNavigate();
  const onViewClick = (agreementId) => {
    navigate(`/app/agreements/details/${agreementId}`);
  };

  const onEditClick = (agreementId) => {
    navigate('/app/agreements/new', {
      state: {
        agreementId,
      },
    });
  };

  const sortOptions = [{
    label: 'Created',
    value: 'createdAt',
  }, {
    label: 'Status',
    value: 'status',
  }, {
    label: 'Type',
    value: 'typeOfAgreement',
  }];
  return (
    <>
      <div className="flex flex-col my-2">
        <Text>Agreement Notifications</Text>
        <DashboardNotifications filterOptions={{
          agreementId: {
            not: null,
          },
        }}
        />
      </div>
      <div className="flex flex-row w-full">
        <AgreementAnalytics />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between my-4">
          <Text>Agreements List</Text>
          <Button
            color={themeColor(colors.agreement)}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/app/agreements/new');
            }}
          >
            Create New Agreement
          </Button>
        </div>
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
        {(listing.loaded && uiConfigs.loading !== loadingStates.LOADING && Boolean(data?.length))
            && (
            <div className="flex flex-col">
              <Table striped>
                <thead>
                  <tr>
                    <th>Reference No.</th>
                    <th>Type</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>First Party</th>
                    <th>Second Party</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      data.filter((v) => v.agreementData.json
                          && v.agreementData.json.typeOfAgreement).map(
                        (row) => (
                          <tr key={row.id}>
                            <td>
                              {`Agreement-${row.id}`}
                            </td>
                            <td>
                              {row.agreementData.json.typeOfAgreement}
                            </td>
                            <td>
                              <UserAvatarView {...row.createdBy} />
                            </td>
                            <td>
                              <Badge color={agreementStatusColors[row.status] || 'orange'}>
                                {row.status}
                              </Badge>
                            </td>
                            <td>
                              {row.agreementData?.json?.firstParty?.name || '-'}
                            </td>
                            <td>
                              {row.agreementData?.json?.secondParty?.name || '-'}
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
                                {row.agreementData?.json.formCompleted
                                    && (
                                    <ActionIcon
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
            </div>
            )}
        {(listing.loaded && uiConfigs.loading !== loadingStates.LOADING && !(data?.length))
            && (
            <div
              className="flex justify-center items-center"
              style={{
                minHeight: '300px',
              }}
            >
              No agreements
            </div>
            )}
      </div>
      {listing.agreementsCount
          && (
          <div className="flex flex-row justify-center my-4">
            <Pagination
              page={uiConfigs.page}
              onChange={((page) => {
                setUiConfigs({
                  ...uiConfigs,
                  page,
                });
              })}
              total={Math.ceil(listing.agreementsCount / 10)}
            />
          </div>
          )}
    </>
  );
};

export default AgreementsListingPage;
