import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from '@mantine/form';
import flat from 'flat';
import { Center, Stepper } from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { loadingStates } from '../../../utilities/utilities';
import colors from '../../../utilities/design';
import { apiWrapWithErrorWithData } from '../../../utilities/apiHelpers';
import { buildNewNotice, fetchNoticeDetails, updateNotice } from '../../../utilities/apis/notices';
import NoticeForm1 from './NoticeForm1';
import NoticeForm2 from './NoticeForm2';
import NoticeForm3 from './NoticeForm3';
import NoticeForm4 from './NoticeForm4';

const NoticeCreatePage = () => {
  const FORM_STEPS = {
    STEP_1: 0,
    STEP_2: 1,
    STEP_3: 2,
    STEP_4: 3,
  };
  const { state } = useLocation();
  const [configs, setConfigs] = useState({
    noticeDetails: null,
  });
  const initialState = {
    senders: [],
    receivers: [],
    noticePeriodDays: 7,
    noticePurpose: 'Money Recovery',
    noticeSubPurpose: 'NDA Voilation',
  };
  const noticeForm = useForm({ initialValues: flat(initialState) });
  const [uiConfigs, setUiConfigs] = useState({
    currentStep: FORM_STEPS.STEP_1,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    noticeLoaded: false,
  });
  const saveNotice = async (values) => {
    const noticeData = ({
      json: flat.unflatten(values || noticeForm.values),
      flatted: values || (noticeForm.values),
    });
    const toUse = configs.noticeDetails?.noticeId ? updateNotice : buildNewNotice;
    const args = configs.noticeDetails?.noticeId
      ? ({ noticeId: configs.noticeDetails.noticeId, noticeData })
      : ({ noticeData, requestNoticeId: state?.requestNoticeId || null });
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(toUse(args));
    if (response?.success) {
      showNotification({
        color: 'green',
        title: 'Notice Form',
        message: 'Details saved.',
      });
      if (response?.notice?.id) {
        setConfigs({
          ...configs,
          noticeDetails: {
            noticeId: response.notice.id,
          },
        });
        setUiConfigs((stateC) => ({
          ...stateC,
          noticeLoaded: true,
        }));
      }
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Form',
        message: 'Something went wrong.',
      });
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
      return false;
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
    return true;
  };

  const fetchNotice = async (noticeId) => {
    setUiConfigs((stateC) => ({
      ...stateC,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(fetchNoticeDetails({ noticeId }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        noticeDetails: {
          noticeId: resp.notice.id,
          notice: resp.notice,
          noticeData: resp.notice.noticeData,
        },
      }));
      setUiConfigs((stateC) => ({
        ...stateC,
        noticeLoaded: true,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      noticeForm.setValues({ ...flat(resp.notice.noticeData.json) });
    } else {
      setUiConfigs((stateC) => ({
        ...stateC,
        noticeLoaded: true,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        title: 'Notice Details',
        message: 'Something went wrong.',
      });
    }
  };

  useEffect(() => {
    if (state?.noticeId) {
      fetchNotice(state.noticeId);
    }
  }, []);

  if (state?.noticeId && !uiConfigs.noticeLoaded) {
    return (
      <Center>
        <BeatLoader size={10} color={colors.primary} />
      </Center>
    );
  }

  const allowStepSelect = !!noticeForm.values.formCompleted;

  return (
    <Stepper
      active={uiConfigs.currentStep}
      onStepClick={(stepIndex) => {
        setUiConfigs((prevState) => ({
          ...prevState,
          currentStep: stepIndex,
        }));
      }}
      breakpoint="sm"
    >
      <Stepper.Step allowStepSelect={allowStepSelect} label="Parties">
        <NoticeForm1
          noticeId={configs.noticeDetails?.noticeId}
          saveNotice={saveNotice}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          noticeForm={noticeForm}
        />
      </Stepper.Step>

      <Stepper.Step allowStepSelect={allowStepSelect} label="Purpose ">
        <NoticeForm2
          noticeId={configs.noticeDetails?.noticeId}
          saveNotice={saveNotice}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          noticeForm={noticeForm}
        />
      </Stepper.Step>

      <Stepper.Step allowStepSelect={allowStepSelect} label="Period">
        <NoticeForm3
          noticeId={configs.noticeDetails?.noticeId}
          saveNotice={saveNotice}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          noticeForm={noticeForm}
        />
      </Stepper.Step>

      <Stepper.Step allowStepSelect={allowStepSelect} label="Documents">
        <NoticeForm4
          noticeId={configs.noticeDetails?.noticeId}
          saveNotice={saveNotice}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          noticeForm={noticeForm}
        />
      </Stepper.Step>
    </Stepper>

  );
};

export default NoticeCreatePage;
