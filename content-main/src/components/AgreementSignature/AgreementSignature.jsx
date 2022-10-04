/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { Skeleton, Button } from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { isLoading, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import {
  cancelAgreementSignature,
  getAgreementSignStatusApi,
  sendAgreementForSignature,
} from '../../utilities/apis/agreements';
import styles from '../SignatureStatus/SignatureStatusMain.module.css';
import SignatureStatus from '../SignatureStatus/SignatureStatus';
import SignatureRequest from '../SignatureRequest/SignatureRequest';
import colors from '../../utilities/design';

const AgreementSignature = ({
  emails, names, agreementId, reloadAgreement,
}) => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    loadingCancellation: loadingStates.NO_ACTIVE_REQUEST,
    loadingSignRequest: loadingStates.NO_ACTIVE_REQUEST,
    agreementSignature: null,
  });

  const getAgreementSignStatus = async () => {
    setConfigs((stateC) => ({
      ...stateC,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(getAgreementSignStatusApi({ agreementId }));
    if (resp?.success && resp?.agreement) {
      setConfigs((stateC) => ({
        ...stateC,
        agreementSignature: resp.agreement,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      showNotification({
        color: 'red',
        message: 'Couldn\'t get agreement signature status',
        title: 'Agreement SignatureRequest',
      });
      setConfigs((stateC) => ({
        ...stateC,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  const sendForSignature = async (params) => {
    setConfigs((stateC) => ({
      ...stateC,
      loadingSignRequest: loadingStates.LOADING,
    }));
    // let base64File;
    // try {
    //   const { base64File: b64File } = await getPreviewUrl(quillDelta);
    //   base64File = b64File;
    // } catch (e) {
    //   showNotification({
    //     color: 'red',
    //     message: 'Couldn\'t send agreement for signature',
    //     title: 'Agreement SignatureRequest',
    //   });
    //   setConfigs((stateC) => ({
    //     ...stateC,
    //     loadingSignRequest: loadingStates.NO_ACTIVE_REQUEST,
    //   }));
    //   return;
    // }
    const resp = await apiWrapWithErrorWithData(sendAgreementForSignature({
      signers: emails.map((e, i) => ({ email: e, first_name: names[i], last_name: '' })),
      agreementId,
      ...params,
    }));
    if (resp?.success && resp?.agreement) {
      setConfigs((stateC) => ({
        ...stateC,
        loadingSignRequest: loadingStates.NO_ACTIVE_REQUEST,
      }));
      getAgreementSignStatus();
    } else {
      showNotification({
        color: 'red',
        message: 'Couldn\'t send agreement for signature',
        title: 'Agreement SignatureRequest',
      });
      setConfigs((stateC) => ({
        ...stateC,
        loadingSignRequest: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  const cancelSignatureRequest = async () => {
    setConfigs((stateC) => ({
      ...stateC,
      loadingCancellation: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(cancelAgreementSignature({ agreementId }));
    if (resp?.success) {
      getAgreementSignStatus();
      setConfigs((stateC) => ({
        ...stateC,
        loadingCancellation: loadingStates.NO_ACTIVE_REQUEST,
      }));
      if (reloadAgreement) {
        reloadAgreement();
      }
    } else {
      setConfigs((stateC) => ({
        ...stateC,
        loadingCancellation: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        message: 'Couldn\'t send agreement for signature',
        title: 'Agreement SignatureRequest',
      });
    }
  };

  useEffect(() => {
    getAgreementSignStatus();
  }, []);

  if (isLoading(configs.loadingSignRequest)
      || isLoading(configs.loadingCancellation)
      || isLoading(configs.loading)) {
    return (
      <div className="flex flex-col my-4">
        <div className="flex justify-end">
          <Skeleton height={30} radius="md" className="my-1 w-60" />
        </div>
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
        <Skeleton height={30} radius="md" className="my-1 w-full" />
      </div>
    );
  }

  let totalNeedsToSign = 0;
  let totalSigned = 0;

  if (configs.agreementSignature?.signatureId) {
    totalNeedsToSign = (configs.agreementSignature.signStatus.signers.filter(
      (signer) => signer.needs_to_sign,
    )).length;

    totalSigned = (configs.agreementSignature.signStatus.signers.filter(
      (signer) => (signer.signed && signer.needs_to_sign),
    )).length;

    return (
      <div className="flex flex-col pt-12 px-6">
        <div className="flex justify-between">
          {(totalSigned !== totalNeedsToSign) && (
          <div className={`${styles.signHeading} px-2`}>
            Signature request has been sent to following parties.
          </div>
          )}

          {(totalSigned === totalNeedsToSign) && (
          <div className={`${styles.signHeading} px-2`}>
            Signature has been completed by all parties. Check
            {' '}
            <i>documents</i>
            {' '}
            tab for signed agreement.
          </div>
          )}

          {(totalSigned !== totalNeedsToSign)
              && (
              <Button
                disabled={configs.loadingCancellation === loadingStates.LOADING}
                color="red"
                onClick={cancelSignatureRequest}
              >
                {configs.loadingCancellation === loadingStates.LOADING ? <BeatLoader color={colors.primary} size={10} />

                  : <span>Cancel Signature Request</span>}

              </Button>
              )}
        </div>
        <div className={`${styles.statusHeading} mt-8`}>Signature Status</div>
        <div className={`${styles.statusText} mt-7`}>
          Signature status will be updated in real time, however signed agreement might appear in documents after delay of few minutes.
        </div>
        {configs.agreementSignature.signStatus.signers.filter(
          (signer) => signer.needs_to_sign,
        ).map(
          (sign, index) => (
            <SignatureStatus index={index} email={sign.email} status={sign.signed ? 'Signed' : 'Pending'} />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SignatureRequest
        agreementId={agreementId}
        sendForSignature={sendForSignature}
        signers={[
          { email: emails[0], name: names[0] },
          { email: emails[1], name: names[1] },
        ]}
      />
    </div>
  );
};

export default AgreementSignature;
