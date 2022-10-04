import React, { useEffect, useState } from 'react';
import { Center } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { formatDate, loadingStates } from '../../utilities/utilities';
import styles from './CaseRecordDetail.module.css';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import UserAvatarView from '../UserAvatarView';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import colors from '../../utilities/design';
import { getCaseRecordDetails } from '../../utilities/apis/cases';

function CaseRecordDetail({ recordId, parent, parentId }) {
  const [caseRecordDetailsData, setCaseRecordDetailsData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    caseRecordDetails: null,
  });
  const { caseRecordDetails } = caseRecordDetailsData;

  const getCaseRecordDetailsHandler = async () => {
    setCaseRecordDetailsData({
      ...caseRecordDetailsData,
      loading: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(getCaseRecordDetails({
      caseRecordId: recordId,
    }));
    if (resp?.success) {
      setCaseRecordDetailsData({
        ...caseRecordDetailsData,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        caseRecordDetails: resp.caseRecord,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Record Details',
        message: 'Record details could not be loaded.',
      });
    }
  };

  useEffect(() => {
    getCaseRecordDetailsHandler();
  }, []);

  const multiUploadArgs = useMultiFileUpload({ parent: 'caseRecord', parentId: recordId });

  if (!caseRecordDetails || caseRecordDetailsData.loading === loadingStates.LOADING) {
    return (
      <Center>
        <BeatLoader color={colors.primary} size={10} />
      </Center>
    );
  }

  return (
    <div className="flex flex-col px-10 mb-20">
      <div className={`${styles.expenseHeader}`}>
        {`Record - ${caseRecordDetails.id} for ${parent}-${parentId}`}
      </div>
      <div className="grid gap-y-6 grid-cols-3 mt-8">
        <div>
          <div className={`${styles.label}`}>Created By</div>
          <UserAvatarView {...caseRecordDetails.createdBy} />
        </div>
        <div>
          <div className={`${styles.label}`}>Case Date</div>
          <div className={`${styles.text} mt-1`}>{formatDate(caseRecordDetails.caseDate)}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Purpose</div>
          <div className={`${styles.text} mt-1`}>{caseRecordDetails.purpose}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Next hearing date</div>
          <div className={`${styles.text} mt-1`}>{formatDate(caseRecordDetails.nextHearing)}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Fixed for</div>
          <div className={`${styles.text} mt-1`}>{caseRecordDetails.fixedFor}</div>
        </div>
        <div className="col-span-3">
          <div className={`${styles.label}`}>Summary </div>
          <div className={`${styles.text}  mt-1`}>{caseRecordDetails.summary}</div>
        </div>
      </div>
      <div className={`${styles.label} pt-6`}>Files</div>
      <NewDocumentUploader hideDeleteButton hideDropZone multiUploadArgs={multiUploadArgs} />
    </div>
  );
}

export default CaseRecordDetail;
