import { showNotification } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from '@mantine/core';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { expenseMonthlyApi } from '../utilities/apis/budgetManager';
import { loadingStates } from '../utilities/utilities';

function DashboardGraph() {
  const [configs, setConfigs] = useState({
    listLoading: loadingStates.NO_ACTIVE_REQUEST,
    expenseLoading: loadingStates.NO_ACTIVE_REQUEST,
    list: null,
    expenseList: null,
    // module: 'Case',
  });
  const fetchMonthlyExpense = async () => {
    setConfigs((prevState) => ({
      ...prevState,
      expenseLoading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(expenseMonthlyApi());
    if (resp?.success) {
      setConfigs((prevState) => ({
        ...prevState,
        expenseLoading: loadingStates.NO_ACTIVE_REQUEST,
        expenseList: resp.listExpenseMonth,
        // console.log(top);
      }));
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        expenseLoading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Financial Analytics',
        message: "Couldn't load Monthly Expense",
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchMonthlyExpense();
  }, []);

  //   console.log(configs.expenseList);

  return (
    <div className="pb-12">
      <div
        className="border-solid border-gray-100 border-2 rounded-lg p-4 mt-4"
        style={{ border: 'none', boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1)' }}
      >
        <div className="mt-2">
          MONTHLY ACTIVITIES
        </div>
        {configs.expenseLoading === loadingStates.LOADING
          && <Skeleton style={{ height: '200px' }} className="mt-4 mx-8" visible />}
        {configs.expenseLoading === loadingStates.NO_ACTIVE_REQUEST && configs.expenseList
            && (
            <div
              className="mt-4 w-full"
              style={{
                // height: '350px',
                height: '200px',
                width: '100%',
              }}
            >
              <Bar
            // data={state}
                data={{
                  // labels: ['January', 'February', 'March',
                  //   'April', 'May', 'June', 'July', 'August',
                  //  'September', 'October', 'November', 'December'],
                  labels: configs.expenseList.map((el) => `${el.month} ${el.year}`),
                  datasets: [
                    {
                      label: 'Expense',
                      backgroundColor: 'rgba(140, 233, 154, 0.6)',
                      barThickness: 30,
                      barPercentage: 0.5,
                      // eslint-disable-next-line dot-notation
                      data: configs.expenseList.map((el) => el['_sum'].amount),
                      //   data: [65, 59, 80, 81, 56],
                    },
                  ],
                }}
                // options={{
                //   responsive: true,
                //   title: {
                //     display: true,
                //     text: 'MONTHLY ACTIVITIES',
                //     fontSize: 20,
                //   },
                //   legend: {
                //     display: true,
                //     position: 'right',
                //   },
                // }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'MONTHLY ACTIVITIES',
                    },
                  },
                }}
              />
            </div>
            )}
      </div>
    </div>
  );
}

export default DashboardGraph;
