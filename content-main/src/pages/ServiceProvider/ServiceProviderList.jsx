import { React, useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  ActionIcon, Anchor,
  Modal,
  Badge, Pagination, Select, Skeleton, Table, TextInput, Button,
} from '@mantine/core';
import {
  Eye, Search, SortAscending,
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { listServiceProviders } from '../../utilities/apis/serviceProvider';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getValueForInput, loadingStates } from '../../utilities/utilities';
import ServiceProviderForm from '../../components/ServiceProviderForm/ServiceProviderForm';
import ServiceProviderAnalytics from './ServiceProviderAnalytics';

const ServiceProviderList = () => {
  const [configs, setConfigs] = useState({
    list: null,
    serviceProvidersCount: null,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    page: 1,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchString: '',
    formOpen: false,
  });

  const [debouncedSearchInput] = useDebouncedValue(configs.searchString, 500);

  const fetchServiceProviders = async () => {
    if (configs.loading === loadingStates.LOADING) {
      return;
    }
    setConfigs((prevState) => ({
      ...prevState,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(listServiceProviders({
      page: configs.page,
      sortByOptions: {
        [configs.sortBy]: configs.sortDirection,
      },
      filterOptions: debouncedSearchInput?.length ? {
        OR: [
          {
            email: {
              contains: debouncedSearchInput,
            },
          },
          {
            name: {
              contains: debouncedSearchInput,
            },
          },
          {
            designation: {
              contains: debouncedSearchInput,
            },
          },
          {
            phone: {
              contains: debouncedSearchInput,
            },
          },
        ],
      } : null,
    }));
    if (resp?.success && resp.serviceProviders) {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        list: resp.serviceProviders,
        serviceProvidersCount: resp.serviceProvidersCount,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        list: null,
      }));
      showNotification({
        title: 'Service Providers',
        message: 'Cannot load service providers list.',
        color: 'red',
      });
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceProviders();
  }, [configs.page, configs.sortBy, configs.sortDirection, debouncedSearchInput]);

  const sortOptions = [{
    label: 'Created',
    value: 'createdAt',
  }, {
    label: 'Name',
    value: 'name',
  }, {
    label: 'Designation',
    value: 'designation',
  }];

  return (
    <div className="flex flex-col">
      <ServiceProviderAnalytics />
      <Modal
        opened={configs.formOpen}
        onClose={() => {
          setConfigs((prevState) => ({
            ...prevState,
            formOpen: false,
          }));
          fetchServiceProviders();
        }}
        size="calc(80vw)"
      >
        <ServiceProviderForm formClose={() => {
          setConfigs((prevState) => ({
            ...prevState,
            formOpen: false,
          }));
          fetchServiceProviders();
        }}
        />
      </Modal>
      <div className="flex justify-end my-2">
        <Button onClick={() => {
          setConfigs((prevState) => ({
            ...prevState,
            formOpen: true,
          }));
        }}
        >
          Add new
        </Button>
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center">
            <TextInput
              disabled={configs.loading === loadingStates.LOADING}
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
            disabled={configs.loading === loadingStates.LOADING}
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
      {configs.loading === loadingStates.LOADING
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
      {(configs.loading !== loadingStates.LOADING && !!configs.list)
            && (
            <div className="flex flex-col">
              <Table striped>
                <thead>
                  <tr>
                    <th>Reference No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Enabled</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      configs.list.map(
                        (row) => (
                          <tr key={row.id}>
                            <td>
                              {`User - ${row.id}`}
                            </td>
                            <td>
                              {`${row.name} `}
                            </td>
                            <td>
                              {`${row.designation || '-'}`}
                            </td>
                            <td>
                              {`${row.email}`}
                            </td>
                            <td>
                              {`${row.phone || '-'}`}
                            </td>
                            <td>
                              <Badge color={row.enabled ? 'green' : 'red'}>{row.enabled ? 'YES' : 'NO'}</Badge>
                            </td>
                            <td>
                              <div className="flex flex-row">
                                <ActionIcon
                                  onClick={() => {
                                    navigate(`/app/service-providers/details/${row.id}`);
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
              {configs.serviceProvidersCount === 0 && (
              <div className="flex justify-center items-center mt-4">
                <div>No Users</div>
              </div>
              )}
              {!!configs.serviceProvidersCount
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
                          total={Math.ceil(configs.serviceProvidersCount / 10)}
                        />
                      </div>
                      )}
            </div>
            )}
    </div>
  );
};

export default ServiceProviderList;
