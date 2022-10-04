/* eslint-disable */
import React, { useState } from 'react';
import {
  SegmentedControl, Textarea, TextInput, Button,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { BeatLoader } from 'react-spinners';
import styles from './ExpenseForm.module.css';
import { existsAndLength, getValueForInput, loadingStates } from '../../utilities/utilities';
import UserSelector from '../UserSelector/UserSelector';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import colors from '../../utilities/design';
import { showNotification } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { selectAllWorkspaceUsers } from '../../redux/selectors';
import { formatISO } from 'date-fns';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { createFinancialEntryApi } from '../../utilities/apis/financials';

function ExpenseForm({ parent, parentId, onModalExit }) {
    const usersFromStore = useSelector(selectAllWorkspaceUsers);

    const getUserIdFromEmail = (email) => {
        const foundUser = usersFromStore.filter(
            (user) => user.email === email,
        );
        if (foundUser.length) {
            return foundUser[0];
        }
        return null;
    };
  const [expenseData, setExpenseData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    type: 'Expense',
    paidToEmail: '',
    paymentPurpose: '',
    paidOn: null,
    description: '',
    amount: 0,
    errors: {},
  });
  const changeHandler = (name) => (input) => {
    const value = getValueForInput(input);
    setExpenseData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const multiUploadArgs = useMultiFileUpload({});

  const { finalFiles } = multiUploadArgs;

  const validate = () => {
      const keys = {};
      if(parseFloat(`${expenseData.amount}`) <= 0){
          keys['amount'] = 'Please check value.'
      }
      if(!existsAndLength(expenseData.paymentPurpose)){
          keys['paymentPurpose'] = 'Please check value.'
      }
      if(!existsAndLength(expenseData.description)){
          keys['description'] = 'Please check value.'
      }
      if(!expenseData.paidOn){
          keys['paidOn'] = 'Please check value.'
      }
      if(Object.keys(keys).length){
          showNotification({
              color: 'red',
              title: 'Expense Create',
              message: 'Make sure all fields are filled properly.',
          });
          setExpenseData((data) => ({
              ...data,
              errors: keys,
          }));
          return false;
      }
      // const { id: userId } = (getUserIdFromEmail(expenseData.paidToEmail) || {});
      // if(!userId){
      //     setExpenseData((data) => ({
      //         ...data,
      //         errors: {},
      //     }));
      //     showNotification({
      //         color: 'red',
      //         title: 'Expense Create',
      //         message: 'Select expense paid to user.',
      //     });
      //     return false;
      // }
      return true;
  };

  const saveHandler = async () => {
      const { id: userId } = (getUserIdFromEmail(expenseData.paidToEmail) || {});
    if(validate()) {
        setExpenseData((data) => ({
            ...data,
            loading: loadingStates.LOADING,
            errors: {},
        }));
        const expenseApiData = {
            parent, parentId,
            type: expenseData.type,
            amount: expenseData.amount,
            paidToId: userId,
            purpose: expenseData.paymentPurpose,
            description: expenseData.description,
            paidOn: formatISO(expenseData.paidOn),
            files: finalFiles,
        };
        const resp = await apiWrapWithErrorWithData(createFinancialEntryApi({
            expenseData: expenseApiData
        }));
        if(resp?.success && resp?.expenseCreated) {
            setExpenseData((data) => ({
                ...data,
                loading: loadingStates.NO_ACTIVE_REQUEST
            }));
            showNotification({
                color: 'green',
                title: 'Expense Created.',
                message: 'Expense has been created.',
            });
            onModalExit();
        } else {
            showNotification({
                color: 'red',
                title: 'Expense Create',
                message: 'Expense could not be created.',
            });
            setExpenseData((data) => ({
                ...data,
                loading: loadingStates.NO_ACTIVE_REQUEST
            }));
        }
    }
  };

  return (
    <div className="flex flex-col px-10">
      <div className={`${styles.expenseHeader}`}>
        Expense for
        { ' '}
        {parent}
        -
        {parentId}
      </div>
      <div className="flex flex-row justify-between">
        <div className={`${styles.expenseTitle} mt-4`}>
          <ul>
            <li>Attach receipts as files if available.</li>
            <li>Select correct date of expense.</li>
          </ul>
        </div>
        <div>
          <SegmentedControl
            color="blue"
            data={[
              { label: 'Expense', value: 'Expense' },
              { label: 'Recovery', value: 'Recovery' },
            ]}
            value={expenseData.type}
            onChange={changeHandler('type')}
          />
        </div>
      </div>
      <div className={`${styles.label} grid gap-x-4 grid-cols-2 mt-8`}>
        <TextInput
          placeholder="Amount"
          label="Amount"
          value={expenseData.amount}
          onChange={changeHandler('amount')}
          error={expenseData.errors.amount}
        />
        <UserSelector
          label="Paid to"
          placeholder="Select an user"
          onChange={changeHandler('paidToEmail')}
          value={expenseData.paidToEmail}
        />
      </div>
      <div className="grid gap-x-4 grid-cols-2 mt-5">
        <TextInput
          placeholder="Payment purpose"
          label="Purpose"
          value={expenseData.paymentPurpose}
          onChange={changeHandler('paymentPurpose')}
          error={expenseData.errors.paymentPurpose}
        />
        <DatePicker
          placeholder="Select payment date"
          label="Paid On"
          value={expenseData.paidOn}
          onChange={changeHandler('paidOn')}
          error={expenseData.errors.paidOn}
        />
      </div>
      <div className="mt-5">
        <Textarea
          minRows={3}
          placeholder="Type description"
          label="Description"
          value={expenseData.description}
          onChange={changeHandler('description')}
          error={expenseData.errors.description}
        />
      </div>
      <div className={`${styles.file} pt-6 font-bold`}>Files</div>
      <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
      <div className="flex justify-end my-8">
        <Button
          onClick={saveHandler}
          disabled={expenseData.loading === loadingStates.LOADING}
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          {expenseData.loading === loadingStates.LOADING
                  && <BeatLoader color={colors.primary} size={10} />}
          {expenseData.loading === loadingStates.NO_ACTIVE_REQUEST
                  && <span>Save</span>}
        </Button>
      </div>
    </div>
  );
}

export default ExpenseForm;
