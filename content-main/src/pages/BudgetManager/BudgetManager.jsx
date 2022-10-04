import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { showNotification } from '@mantine/notifications';
import {
  Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import {
  SegmentedControl, Skeleton, Table, Anchor, Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { financialListApi, topServiceProvidersApi } from '../../utilities/apis/budgetManager';
import BudgetManagerAnalytics from './BudgetManagerAnalytics';
import colors from '../../utilities/design';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const BudgetManager = () => {
  const [configs, setConfigs] = useState({
    listLoading: loadingStates.NO_ACTIVE_REQUEST,
    topSpLoading: loadingStates.NO_ACTIVE_REQUEST,
    list: null,
    topSp: null,
    module: 'Case',
  });
  const listOptions = [
    { label: 'Cases', value: 'Case' },
    { label: 'Notices', value: 'Notice' },
    { label: 'Agreements', value: 'Agreement' },
  ];

  const fetchList = async () => {
    setConfigs((prevState) => ({
      ...prevState,
      listLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(financialListApi({
      module: configs.module.toLowerCase(),
    }));
    if (resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        listLoading: loadingStates.NO_ACTIVE_REQUEST,
        list: resp.list,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        listLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Financial Analytics',
        message: "Couldn't load list.",
        color: 'red',
      });
    }
  };

  const fetchTopSp = async () => {
    setConfigs((prevState) => ({
      ...prevState,
      topSpLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(topServiceProvidersApi());
    if (resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        topSpLoading: loadingStates.NO_ACTIVE_REQUEST,
        topSp: resp.topSpenders,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        topSpLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Financial Analytics',
        message: "Couldn't load top service providers",
        color: 'red',
      });
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchTopSp();
  }, []);

  useEffect(() => {
    fetchList();
  }, [configs.module]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Service Providers',
      },
    },
  };

  return (
    <div className="flex flex-col">
      <BudgetManagerAnalytics />
      <div
        className="border-solid border-gray-100 border-2 rounded-lg p-4 mt-4"
        style={{ border: 'none', boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1)' }}
      >
        <div className="mt-2">
          Top Service Providers
        </div>
        {configs.topSpLoading === loadingStates.LOADING
          && <Skeleton style={{ height: '200px' }} className="mt-4 mx-8" visible />}
        {configs.topSpLoading === loadingStates.NO_ACTIVE_REQUEST && configs.topSp
            && (
            <div
              className="mt-4 w-full"
              style={{
                height: '200px',
                width: '100%',
                // padding: '100px',
                // paddingTop: 0,
              }}
            >
              <Bar
                options={chartOptions}
                data={{
                  labels: configs.topSp.map((sp) => sp.name),
                  datasets: [
                    {
                      barThickness: 30,
                      barPercentage: 0.5,
                      label: 'Amount Paid',
                      // eslint-disable-next-line dot-notation
                      data: configs.topSp.map((sp) => sp['_sum'].amount),
                      backgroundColor: colors.expense,
                    },
                  ],
                }}
              />
            </div>
            )}
      </div>
      <div className="mb-40">
        <div className="flex items-center justify-between mt-4 px-4">
          <Text>Module Finances</Text>
          <SegmentedControl
            disabled={configs.listLoading === loadingStates.LOADING}
            color="blue"
            value={configs.module}
            onChange={(val) => {
              setConfigs((prevState) => ({
                ...prevState,
                module: val,
              }));
            }}
            data={listOptions}
          />
        </div>
        { configs.listLoading === loadingStates.LOADING
            && (
            <div className="flex flex-col mt-4">
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
              <Skeleton height={30} radius="md" className="my-1 w-full" />
            </div>
            )}
        {(configs.listLoading !== loadingStates.LOADING && configs.list)
            && (
            <Table className="mt-4" striped>
              <thead>
                <tr>
                  <th>Reference No.</th>
                  <th>Expense</th>
                  <th>Recovery</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                    configs.list.map(
                      (row) => (
                        <tr key={row.id}>
                          <td>
                            {`${configs.module} - ${row.id}`}
                          </td>
                          <td>
                            {row.Expense ? `Rs. ${row.Expense}` : 'Rs. 0'}
                          </td>
                          <td>
                            {row.Recovery ? `Rs. ${row.Recovery}` : 'Rs. 0'}
                          </td>
                          <td>
                            <Anchor onClick={(e) => {
                              e.stopPropagation();
                              if (configs.module.toLowerCase() === 'case') {
                                navigate(`/app/dispute-manager/cases/details/${row.id}`);
                              }
                              if (configs.module.toLowerCase() === 'notice') {
                                navigate(`/app/dispute-manager/legal-notices/details/${row.id}`, {
                                  state: {
                                    noticeId: row.id,
                                  },
                                });
                              }
                              if (configs.module.toLowerCase() === 'agreement') {
                                navigate(`/app/agreements/details/${row.id}`);
                              }
                            }}
                            >
                              View
                            </Anchor>
                          </td>
                        </tr>
                      ),
                    )
                }
              </tbody>
            </Table>
            )}
      </div>
    </div>
  );
};

export default BudgetManager;
