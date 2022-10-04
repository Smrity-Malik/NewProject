import React, { useEffect, useState } from 'react';
import {
  ActionIcon, Anchor, Badge, Button, Center, Modal, Skeleton, Table, Text, Paper, Pagination,
} from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import smartTruncate from 'smart-truncate';
import { showNotification } from '@mantine/notifications';
import { formatDate, loadingStates } from '../../utilities/utilities';
import UserAvatarView from '../UserAvatarView';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getResourceFinances } from '../../utilities/apis/financials';
import ExpenseDetail from '../ExpenseDetail/ExpenseDetail';

const ExpensesTab = ({ parent, parentId }) => {
  const [expensesConfig, setExpensesConfig] = useState({
    expenseFormVisible: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    expenses: [],
    page: 1,
    expensesCount: null,
    loadExpense: null,
  });

  const getExpenses = async () => {
    setExpensesConfig((expenseC) => ({
      ...expenseC,
      loading: loadingStates.LOADING,
      expensesCount: null,
    }));
    const response = await apiWrapWithErrorWithData(
      getResourceFinances({
        parentResource: parent,
        parentResourceId: parentId,
        page: expensesConfig.page,
      }),
    );
    if (response?.success && response?.expenses) {
      setExpensesConfig((prevState) => ({
        ...prevState,
        expenses: response.expenses,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        expensesCount: response.expensesCount || null,
      }));
    } else {
      showNotification({
        color: 'red',
        title: 'Expenses',
        message: `Failed to load expenses for ${parent} ${parentId}`,
      });
      setExpensesConfig((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  useEffect(() => {
    if (expensesConfig.loadExpense === null || !expensesConfig.expenseFormVisible) {
      getExpenses();
    }
  }, [expensesConfig.loadTask, expensesConfig.expenseFormVisible]);

  const totalExpensesCount = (expensesConfig.expensesCount || []).reduce(
    // eslint-disable-next-line dot-notation
    (acc, expense) => (acc + expense['_count'].id), 0,
  );

  return (
    <>
      {expensesConfig.expenseFormVisible
                && (
                <Modal
                  closeOnClickOutside={false}
                  overflow="inside"
                  opened
                  onClose={() => {
                    setExpensesConfig((prevState) => ({
                      ...prevState,
                      expenseFormVisible: false,
                    }));
                  }}
                  size="calc(80vw)"
                >
                  <ExpenseForm
                    parent={parent}
                    parentId={parentId}
                    onModalExit={() => {
                      setExpensesConfig((prevState) => ({
                        ...prevState,
                        expenseFormVisible: false,
                      }));
                    }}
                  />
                </Modal>
                )}

      {(expensesConfig.loadExpense !== null)
                && (
                <Modal
                  overflow="inside"
                  opened
                  onClose={() => {
                    setExpensesConfig((prevState) => ({
                      ...prevState,
                      loadExpense: null,
                    }));
                  }}
                  size="calc(80vw)"
                >
                  <ExpenseDetail
                    parent={parent}
                    parentId={parentId}
                    expenseId={expensesConfig.loadExpense}
                    onModalExit={() => {
                      setExpensesConfig((prevState) => ({
                        ...prevState,
                        loadExpense: null,
                      }));
                    }}
                  />
                </Modal>
                )}
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-end">
          <div className="flex items-center">
            <ActionIcon color="white" className="mx-2" onClick={getExpenses}>
              <Refresh />
            </ActionIcon>
            <Button
              onClick={() => setExpensesConfig((prevState) => ({
                ...prevState,
                expenseFormVisible: true,
              }))}
              className="w-60 mx-2"
            >
              Create Expense
            </Button>
          </div>
        </div>
        {expensesConfig.loading === loadingStates.LOADING
                    && (
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
        <div className="flex flex-row">
          {(expensesConfig.expensesCount || []).map(
            (expense) => (
              <Paper radius="md" className="flex flex-col justify-center p-4 w-40 mx-8">
                <Text color="black" size="sm">
                  Total
                  {' '}
                  {expense.type}
                </Text>
                <Text color="gray" size="sm">
                  Entries:
                  {' '}
                  {/* eslint-disable-next-line dot-notation */}
                  {expense['_count'].id}
                </Text>
                <Text color="gray" size="sm">
                  Rs.
                  {' '}
                  {/* eslint-disable-next-line dot-notation */}
                  {expense['_sum'].amount}
                </Text>
              </Paper>
            ),
          )}
        </div>
        {((expensesConfig.loading !== loadingStates.LOADING && !expensesConfig.expenses?.length))
                    && <Center className="my-4">No expenses to show</Center>}
        {(expensesConfig.loading !== loadingStates.LOADING && !!expensesConfig.expenses.length) && (
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
            {expensesConfig.expenses.map(
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
                      setExpensesConfig({
                        ...expensesConfig,
                        loadExpense: row.id,
                      });
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
        {Boolean(totalExpensesCount)
                    && (
                    <div className="flex justify-center mt-4">
                      <Pagination
                        onChange={(page) => {
                          setExpensesConfig({
                            ...expensesConfig,
                            page,
                          });
                        }}
                        total={Math.ceil(totalExpensesCount / 10)}
                        page={expensesConfig.page}
                      />
                    </div>
                    )}
      </div>
    </>
  );
};

export default ExpensesTab;
