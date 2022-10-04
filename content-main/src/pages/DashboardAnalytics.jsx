/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { showNotification } from '@mantine/notifications';
import { Grid, Skeleton } from '@mantine/core';
import { loadingStates } from '../utilities/utilities';
import colors from '../utilities/design';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { tasksAnalytics } from '../utilities/apis/tasks';
// import { casesAnalytics } from '../utilities/apis/cases';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardAnalytics = () => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    data: null,
  });

  const chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['#3a36db', '#1f6fbd', '#03a89e', '#8189a9', '#c079af', '#ff69b4'],
        borderColor: ['#3a36db', '#1f6fbd', '#03a89e', '#8189a9', '#c079af', '#ff69b4'],
        borderWidth: 1,
      },
    ],
  };

  const taskStatusWise = (statusWiseData) => {
    const data = structuredClone(chartData);
    data.labels = statusWiseData.map((item) => item.status);
    data.datasets[0].label = 'Tasks by status';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = statusWiseData.map((item) => item['_count'].id);
    data.datasets[0].backgroundColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].backgroundColor[index]);
    data.datasets[0].borderColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].borderColor[index]);
    return ({ ...data });
  };

  const agreementStatusWise = (statusWiseData) => {
    const data = structuredClone(chartData);
    data.labels = statusWiseData.map((item) => item.status);
    data.datasets[0].label = 'Agreement tasks by status';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = statusWiseData.map((item) => item['_count'].id);
    data.datasets[0].backgroundColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].backgroundColor[index]);
    data.datasets[0].borderColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].borderColor[index]);
    return data;
  };
  const noticeStatusWise = (statusWiseData) => {
    const data = structuredClone(chartData);
    data.labels = statusWiseData.map((item) => item.status);
    data.datasets[0].label = 'Tasks by status';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = statusWiseData.map((item) => item['_count'].id);
    data.datasets[0].backgroundColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].backgroundColor[index]);
    data.datasets[0].borderColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].borderColor[index]);
    return ({ ...data });
  };

  useEffect(() => {
    (async () => {
      setConfigs({ ...configs, loading: loadingStates.LOADING });
      const resp = await apiWrapWithErrorWithData(tasksAnalytics());
      if (resp?.success && resp?.analytics) {
        setConfigs({
          ...configs,
          data: resp.analytics,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        });
      } else {
        showNotification({
          color: 'red',
          title: 'Case Analytics',
          message: 'Failed to load case analytics.',
        });
        setConfigs({ ...configs, loading: loadingStates.NO_ACTIVE_REQUEST });
      }
    })();
  }, []);

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
        {(configs.loading !== loadingStates.LOADING && configs.data?.taskStatusWise)
          && (
          <>
            {/* <Grid.Col span={4}>
              <div className="border-solid border-gray-100 border-2 rounded-lg p-4">
                <div>Task by status</div>
                <div
                  style={{
                    height: '240px',
                    width: '100%',
                    padding: '16px',
                  }}
                >
                  <Doughnut
                    id="chart-1"
                    data={dataForCaseStatus(configs.data.taskStatusWise)}
                    options={{ ...chartOptions }}
                  />
                </div>
              </div>
            </Grid.Col> */}
            <Grid.Col span={4}>
              <div
                // className="border-solid border-gray-100 border-2 rounded-lg p-4"
                className="border-2 border-none rounded-lg p-4"
                style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
              >
                <div>Task by status</div>
                <div
                  style={{
                    // height: '240px',
                    height: '200px',
                    width: '100%',
                    padding: '16px',
                  }}
                >
                  <Doughnut
                    data={taskStatusWise(configs.data.taskStatusWise)}
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
                <div>Agreement by status</div>
                <div
                  style={{
                    // height: '240px',
                    height: '200px',
                    width: '100%',
                    padding: '16px',
                  }}
                >
                  <Doughnut
                    data={agreementStatusWise(configs.data.agreementStatusWise)}
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
                <div>Notice by status</div>
                <div
                  style={{
                    // height: '240px',
                    height: '200px',
                    width: '100%',
                    padding: '16px',
                  }}
                >
                  <Doughnut
                    id="chart-1"
                    data={noticeStatusWise(configs.data.noticeStatusWise)}
                    options={{ ...chartOptions }}
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

export default DashboardAnalytics;
