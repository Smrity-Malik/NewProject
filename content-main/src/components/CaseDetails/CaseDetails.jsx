import React from 'react';
import { Badge, Button } from '@mantine/core';
import CaseInfo from './CaseInfo';
import CompanyRepresentative from './CompanyRepresentative';
import CourtDetails from './CourtDetails';
import AddressRenderer from './AddressRenderer';
import styles from './CaseDetails.module.css';
import { formatDate, formatTime } from '../../utilities/utilities';
import { caseStatusColors } from '../../utilities/enums';

function CaseDetails({
  caseData, caseId, upperHalf, lowerHalf, nextDate,
  onEditClick,
}) {
  return (
    <>
      {upperHalf && (
        <div className="flex flex-col pl-4 mb-20">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className={styles.caseNumber}>
                C -
                {' '}
                {caseId}
              </div>
              <div className="flex flex-row mt-4">
                <div className="flex flex-row mr-4">
                  <img className="pr-2" src="/assets/images/calendar.svg" alt="calendar" />
                  <span className={styles.dateTime}>
                    Created on
                    {' '}
                    {formatDate(caseData.createdAt)}
                  </span>
                </div>
                <div className="flex flex-row mr-4">
                  <img className="pr-2" src="/assets/images/clock.svg" alt="clock" />
                  {/* Time at */}
                  <span className={styles.dateTime}>
                    {' '}
                    {formatTime(caseData.createdAt)}
                  </span>
                </div>
                <div className="flex flex-row mr-4">
                  <img className="pr-2" src="/assets/images/eye.svg" alt="eye" />
                  <span className={styles.dateTime}>
                    Created by
                    {' '}
                    {caseData.createdBy.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-col">
              <Badge size="lg" color={caseStatusColors[caseData.status] || 'orange'}>
                {caseData.status}
              </Badge>
              <Button
                onClick={onEditClick}
                className="ml-4"
                style={{
                  backgroundColor: '#46BDE1',
                  borderRadius: '0.5rem',
                  color: '#F5F5F5',
                  width: '180px',
                }}
              >
                Edit
              </Button>
            </div>
          </div>
          <CaseInfo {...caseData.caseNumber} amount={caseData.amount} />
          <CompanyRepresentative {...caseData.companyRepresentative} />
        </div>
      )}
      { lowerHalf && (
      <div className="flex flex-col pt-7 pl-4 mb-20">
        <CourtDetails nextDateMain={nextDate} {...caseData.courtDetails} />
        <div className="mt-7">
          <div className={styles.title}>Complainants</div>
          {caseData.complainant.map((obj) => <AddressRenderer {...obj} />)}
        </div>
        <div className="mt-7">
          <div className={styles.title}>Respondents</div>
          {caseData.respondent.map((obj) => <AddressRenderer {...obj} />)}
        </div>
        <div className="mt-7">
          <div className={styles.title}>Complainant Lawyer</div>
          {caseData['complainant lawyer'].map((obj) => <AddressRenderer {...obj} />)}
        </div>
        <div className="mt-7">
          <div className={styles.title}>Respondents Lawyer</div>
          {/* {caseData['respondent lawyer'].map((obj) => <AddressRenderer {...obj} />)} */}
          {caseData['complainant lawyer'].map((obj) => <AddressRenderer {...obj} />)}
        </div>
      </div>
      )}
    </>
  );
}

export default CaseDetails;
