import React from 'react';
import { Badge, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import styles from './AgreementDetail.module.css';
import ContractDetail from './ContractDetail';
import PartyDetail from './PartyDetail';
import { formatDate, formatTime } from '../../utilities/utilities';
import { agreementStatusColors } from '../../utilities/enums';
// import AddressRenderer from '../CaseDetails/AddressRenderer';

function AgreementDetail({
  typeOfAgreement,
  contractTermInDays: termOfContractInDays,
  dateOfContract, id: agreementId, firstParty,
  secondParty, status: agreementStatus, contractEndDate, createdAt,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col pt-7 pl-4 pr-7">
      <div className={styles.title}>Agreement</div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="flex flex-row">
          <div className="flex flex-row mr-4">
            <img className="pr-2" src="/assets/images/calendar.svg" alt="calendar" />
            <span className={styles.dateTime}>
              Created on
              {' '}
              {formatDate(createdAt)}
            </span>
          </div>
          <div className="flex flex-row mr-4">
            <img className="pr-2" src="/assets/images/clock.svg" alt="clock" />
            <span className={styles.dateTime}>
              {' '}
              {formatTime(createdAt)}
            </span>
          </div>
        </div>
        <div>
          <Badge
            style={{
              // backgroundColor: '#FFF8B5',
              borderRadius: '16px',
              // color: '#121212',
              padding: '3px 8px',
              width: '170px',
              height: '33px',
            }}
            color={agreementStatusColors[agreementStatus] || 'orange'}
          >
            {/* In Process */}
            {agreementStatus}
          </Badge>
          <Button
            className="ml-4"
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
              width: '180px',
            }}
            onClick={() => {
              navigate('/app/agreements/edit', {
                state: {
                  // agreementId: agreementData.agreementId,
                  agreementId,
                },
              });
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <ContractDetail
        typeOfAgreement={typeOfAgreement}
        termOfContractInDays={termOfContractInDays}
        dateOfContract={dateOfContract}
        endDate={contractEndDate}
      />
      <div>
        <div className={styles.title}>First Party</div>
        <PartyDetail {...firstParty} />
        {/* <AddressRenderer {...firstParty} /> */}
      </div>
      <div>
        <div className={styles.title}>Second Party</div>
        {/* <AddressRenderer {...secondParty} /> */}
        <PartyDetail {...secondParty} />
      </div>
    </div>
  );
}

export default AgreementDetail;
