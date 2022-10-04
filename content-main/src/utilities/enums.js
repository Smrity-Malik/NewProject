import colors, { themeColor } from './design';

export const caseStatusValues = ['CREATED', 'MEDIATION', 'EVIDENCE', 'ARGUMENT', 'COMPLETED', 'ARCHIVED'];

export const taskStatusValues = ['CREATED', 'IN PROCESS', 'COMPLETED', 'ARCHIVED'];

export const caseStatusColors = {
  CREATED: themeColor(colors.created),
  MEDIATION: 'pink',
  EVIDENCE: 'violet',
  ARGUMENT: 'indigo',
  COMPLETED: 'green',
  ARCHIVED: 'gray',
};

export const noticeStatusColors = {
  CREATED: themeColor(colors.created),
  DRAFT: 'pink',
  SENT: 'violet',
  NEGOTIATION: 'indigo',
  CONCLUDED: 'green',
};

export const noticeRequestStatusColors = {
  CREATED: themeColor(colors.created),
  APPROVED: 'green',
  REJECTED: 'red',
};

export const agreementStatusColors = {
  CREATED: themeColor(colors.created),
  DRAFT: 'pink',
  SIGNATURE: 'violet',
  SIGNED: 'green',
};

export const taskStatusColors = {
  CREATED: themeColor(colors.created),
  'IN PROCESS': themeColor(colors['in process']),
  COMPLETED: themeColor(colors.completed),
  ARCHIVED: 'gray',
};

export const moduleColors = {
  case: themeColor(colors.case),
  agreement: themeColor(colors.agreement),
  notice: themeColor(colors.notice),
  task: themeColor(colors.task),
  cases: themeColor(colors.cases),
  agreements: themeColor(colors.agreements),
  notices: themeColor(colors.notices),
  tasks: themeColor(colors.tasks),
};
