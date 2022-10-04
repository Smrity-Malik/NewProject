import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { Grid, Skeleton } from '@mantine/core';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { financialAnalyticsApi } from '../../utilities/apis/budgetManager';
import colors from '../../utilities/design';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetManagerAnalytics = () => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    analytics: null,
  });
  const fetchAnalytics = async () => {
    setConfigs((prevState) => ({
      ...prevState,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(financialAnalyticsApi());
    if (resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        analytics: resp.analytics,
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Financial Analytics',
        message: "Couldn't load financial analytics",
        color: 'red',
      });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxHeight: 10,
          boxWidth: 10,
        },
      },
    },
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const dataForChart = (dataIncoming) => {
    const data = {
      labels: [],
      datasets: [{}],
    };
    data.labels = dataIncoming.map((item) => item.type);
    data.datasets[0].label = 'Financials';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = dataIncoming.map((item) => item['_sum'].amount);
    data.datasets[0].backgroundColor = dataIncoming.map((item) => colors[item.type.toLowerCase()]);
    data.datasets[0].borderColor = dataIncoming.map((item) => colors[item.type.toLowerCase()]);
    return ({ ...data });
  };

  return (
    <div className="w-full">
      <Grid>
        {configs.loading === loadingStates.LOADING
                    && (
                    <>
                      <Grid.Col span={4}>
                        <Skeleton style={{ height: '310px' }} className="mx-8" visible />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Skeleton style={{ height: '310px' }} className="mx-8" visible />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Skeleton style={{ height: '310px' }} className="mx-8" visible />
                      </Grid.Col>
                    </>
                    )}
        {(configs.loading !== loadingStates.LOADING && configs.analytics?.caseData)
                    && (
                    <>
                      <Grid.Col span={4}>
                        <div
                          className="border-2 border-none rounded-lg p-4"
                          style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
                        >
                          <div>Cases Financials</div>
                          <div
                            style={{
                              height: '200px',
                              width: '100%',
                              padding: '16px',
                            }}
                          >
                            <Doughnut
                              id="chart-1"
                              data={dataForChart(configs.analytics.caseData)}
                              options={{ ...chartOptions }}
                            />
                          </div>
                        </div>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <div
                          className="border-2 border-none rounded-lg p-4"
                          style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
                        >
                          <div>Agreements Financials</div>
                          <div
                            style={{
                              height: '200px',
                              width: '100%',
                              padding: '16px',
                            }}
                          >
                            <Doughnut
                              data={dataForChart(configs.analytics.agreementData)}
                              options={chartOptions}
                            />
                          </div>
                        </div>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <div
                          className="border-2 border-none rounded-lg p-4"
                          style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
                        >
                          <div>Notices Financials</div>
                          <div
                            style={{
                              height: '200px',
                              width: '100%',
                              padding: '16px',
                            }}
                          >
                            <Doughnut
                              data={dataForChart(configs.analytics.noticeData)}
                              options={chartOptions}
                            />
                          </div>
                        </div>
                      </Grid.Col>
                    </>
                    )}
      </Grid>
    </div>
  );
};

export default BudgetManagerAnalytics;
