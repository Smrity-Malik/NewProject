import React, { useEffect, useState } from 'react';
import { Badge, Center } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { formatDate, loadingStates } from '../../utilities/utilities';
import styles from './ExpenseDetail.module.css';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getExpenseDetails } from '../../utilities/apis/financials';
import UserAvatarView from '../UserAvatarView';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import colors from '../../utilities/design';

function ExpenseDetail({ expenseId, parent, parentId }) {
  const [expenseDetailData, setExpenseDetailsData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    expenseDetails: null,
  });
  const { expenseDetails } = expenseDetailData;

  const getExpenseDetailsHandler = async () => {
    setExpenseDetailsData({
      ...expenseDetailData,
      loading: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(getExpenseDetails({
      expenseId,
    }));
    if (resp?.success) {
      setExpenseDetailsData({
        ...expenseDetailData,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        expenseDetails: resp.expense,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Expense Details',
        message: 'Expense details could not be loaded.',
      });
    }
  };

  useEffect(() => {
    getExpenseDetailsHandler();
  }, []);

  const multiUploadArgs = useMultiFileUpload({ parent: 'expense', parentId: expenseId });

  if (!expenseDetails || expenseDetailData.loading === loadingStates.LOADING) {
    return (
      <Center>
        <BeatLoader color={colors.primary} size={10} />
      </Center>
    );
  }

  return (
    <div className="flex flex-col px-10 mb-20">
      <div className={`${styles.expenseHeader}`}>
        {`Expense - ${expenseDetails.id} for ${parent}-${parentId}`}
      </div>
      <div className="flex flex-row justify-end">
        {expenseDetails.type.toLowerCase() === 'expense'
              && (
              <Badge color="orange">
                {expenseDetails.type}
              </Badge>
              )}
        {expenseDetails.type.toLowerCase() === 'recovery'
              && (
              <Badge color="green">
                {expenseDetails.type}
              </Badge>
              )}
      </div>
      <div className="grid gap-y-6 grid-cols-3 mt-8">
        <div>
          <div className={`${styles.label}`}>Paid To</div>
          {expenseDetails.paidTo ? <UserAvatarView {...expenseDetails.paidTo} /> : <span>-</span>}
        </div>
        <div>
          <div className={`${styles.label}`}>Created By</div>
          <UserAvatarView {...expenseDetails.createdBy} />
        </div>
        <div>
          <div className={`${styles.label}`}>Amount</div>
          <div className={`${styles.text} mt-1`}>{`Rs. ${expenseDetails.amount}`}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Purpose</div>
          <div className={`${styles.text} mt-1`}>{expenseDetails.purpose}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Paid On</div>
          <div className={`${styles.text} mt-1`}>{formatDate(expenseDetails.paidOn)}</div>
        </div>
        <div className="col-span-3">
          <div className={`${styles.label}`}>Description </div>
          <div className={`${styles.text}  mt-1`}>{expenseDetails.description}</div>
        </div>
      </div>
      <div className={`${styles.label} pt-6`}>Files</div>
      <NewDocumentUploader hideDeleteButton hideDropZone multiUploadArgs={multiUploadArgs} />
    </div>
  );
}

export default ExpenseDetail;
