/* eslint-disable */
// import { React, useState } from 'react';
import React, { useState } from 'react';
import {
  Textarea, Select, TextInput, Button,
} from '@mantine/core';
// import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { formatISO } from 'date-fns';
import styles from './CaseRecordForm.module.css';
import {
  existsAndLength, getValueForInput, isDateObj, loadingStates,
} from '../../utilities/utilities';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { createCaseRecord } from '../../utilities/apis/cases';
import { BeatLoader } from 'react-spinners';
import colors from '../../utilities/design';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import { DatePicker } from '@mantine/dates';

function CaseRecordForm({ parentId, onModalExit }) {
  const [caseRecordData, setCaseRecordData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    caseDate: null,
    purpose: '',
    nextHearing: null,
    fixedFor: '',
    description: '',
    errors: {},
  });
  const changeHandler = (name) => (input) => {
    const value = getValueForInput(input);
    setCaseRecordData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const multiUploadArgs = useMultiFileUpload({});

  const { finalFiles } = multiUploadArgs;

  const validate = () => {
    const keys = {};
    if (!isDateObj(caseRecordData.caseDate)) {
      keys.caseDate = 'Please check value.';
    }
    if (!existsAndLength(caseRecordData.purpose)) {
      keys.purpose = 'Please check value.';
    }
    if (!isDateObj(caseRecordData.nextHearing)) {
      keys.nextHearing = 'Please check value.';
    }
    if (!existsAndLength(caseRecordData.fixedFor)) {
      keys.fixedFor = 'Please check value.';
    }

    if (!existsAndLength(caseRecordData.description)) {
      keys.description = 'Please check value.';
    }

    if (Object.keys(keys).length) {
      showNotification({
        color: 'red',
        title: 'Case Record',
        message: 'Make sure all fields are filled properly.',
      });
      setCaseRecordData((data) => ({
        ...data,
        errors: keys,
      }));
      return false;
    }
    return true;
  };

  const saveHandler = async () => {
    if (validate()) {
      // console.log('here');
      setCaseRecordData((data) => ({
        ...data,
        loading: loadingStates.LOADING,
        errors: {},
      }));
      const caseRecordApiData = {
        caseId: parentId,
        purpose: caseRecordData.purpose,
        caseDate: formatISO(caseRecordData.caseDate),
        nextHearing: formatISO(caseRecordData.nextHearing),
        fixedFor: caseRecordData.fixedFor,
        summary: caseRecordData.description,
        files: finalFiles,
      };
      const resp = await apiWrapWithErrorWithData(createCaseRecord({
        caseRecordData: caseRecordApiData,
      }));
      if (resp?.success && resp?.caseRecord) {
        setCaseRecordData((data) => ({
          ...data,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
        showNotification({
          color: 'green',
          title: 'Case Record Created.',
          message: 'Expense has been created.',
        });
        onModalExit();
      } else {
        showNotification({
          color: 'red',
          title: 'Case Record',
          message: 'Case Record could not be created.',
        });
        setCaseRecordData((data) => ({
          ...data,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
      }
    }
  };

  return (
    <div className="flex flex-col px-10">
      <div className="flex flex-row justify-between">
        <div className={`${styles.caseHeader}`}>Case record for case-{parentId}</div>
      </div>
      <div className={`${styles.label} grid gap-x-4 grid-cols-2 mt-5`}>
        <DatePicker
            placeholder="Select case date"
            label="Case date"
            value={caseRecordData.caseDate}
            onChange={changeHandler('caseDate')}
            error={caseRecordData.errors.caseDate}
        />
        <DatePicker
            placeholder="Select next date"
            label="Next hearing"
            value={caseRecordData.nextHearing}
            onChange={changeHandler('nextHearing')}
            error={caseRecordData.errors.nextHearing}
        />
      </div>
      <div className={`${styles.label} grid gap-x-4 grid-cols-2 mt-5`}>
        <TextInput
          label="Purpose"
          placeholder="Purpose"
          value={caseRecordData.purpose}
          onChange={changeHandler('purpose')}
          error={caseRecordData.errors.purpose}
        />
        <TextInput
          placeholder="Fixed for"
          label="Fixed for"
          value={caseRecordData.fixedFor}
          onChange={changeHandler('fixedFor')}
          error={caseRecordData.errors.fixedFor}
        />
      </div>
      <div className={`${styles.label} mt-5`}>
        <Textarea
          placeholder="Summary"
          label="Summary"
          value={caseRecordData.description}
          onChange={changeHandler('description')}
          error={caseRecordData.errors.description}
        />
      </div>
      <div className={`${styles.file} pt-6`}>Files</div>
      <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
      <div className="flex justify-end my-8">
        <Button
            onClick={saveHandler}
            disabled={caseRecordData.loading === loadingStates.LOADING}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
        >
          {caseRecordData.loading === loadingStates.LOADING
              && <BeatLoader color={colors.primary} size={10} />}
          {caseRecordData.loading === loadingStates.NO_ACTIVE_REQUEST
              && <span>Save</span>}
        </Button>
      </div>
    </div>
  );
}

export default CaseRecordForm;
