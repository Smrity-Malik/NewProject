/* eslint-disable */
import { getCookiesSession } from '../cookiesSession';
import { format, parseISO } from 'date-fns';

export const assetsPrefix = '/assets';

export const loadingStates = {
  NO_ACTIVE_REQUEST: 'NO_ACTIVE_REQUEST',
  LOADING: 'LOADING',
  FINISHED: 'FINISHED',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED',
};

export const getUserDataFromCookies = () => {
  let data = null;
  try {
    data = JSON.parse(getCookiesSession('trueCounselUserData'));
  } catch (e) {
    console.log(e);
  }
  return data;
};

export const cleanFileObj = (file) => {
  let fileName = file.fileData ? file.fileData.name : null;
  if (!fileName && file.name) {
    fileName = file.name;
  }
  if (!fileName && file.filename) {
    fileName = file.filename;
  }
  if (!fileName && file.fileName) {
    fileName = file.fileName;
  }
  if(!fileName && file.destination){
    fileName = getFileName(file.destination);
  }
  if(!fileName || !fileName.length){
    fileName = 'Un-Named File';
  }
  return ({
    fileName,
    destination: file.destination || null,
  });
};

export function nl2br(str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (`${str}`).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
}

export const getFileName = (url) => {
  const decoded = decodeURI(decodeURI(url));
  const splits = decoded.split('-tc-');
  if (splits.length === 2) {
    return (splits[splits.length - 1]).split('/').pop().split('#')[0].split('?')[0];
  }
  return null;
};

export const noticeRequestStatuses = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  ALL: '',
};

export const noticeStatuses = {
  ALL: '',
  ['INITIAL DRAFT']: 'INITIAL DRAFT',
  DRAFT: 'DRAFT',
  SENT: 'SENT',
};

export const validateEmail = (email) => {
  return String(email)
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const validateMobile = (phone) => {
  return !isNaN(parseInt(phone, 10))
}

export const validateAddress = (addr) => {
  const erroredKeys = [];
  if (!addr.type.length) {
    erroredKeys.push('type');
  }
  if (addr.name.length < 3) {
    erroredKeys.push('name');
  }
  if (addr.email.length < 3) {
    erroredKeys.push('email');
  }
  if (!validateEmail(addr.email)) {
    erroredKeys.push('email');
  }
  if (addr.type === 'Individual') {
    if(addr.phone.length < 10){
      erroredKeys.push('phone')
    }
    if(isNaN(parseInt(addr.phone, 10))){
      erroredKeys.push('phone')
    }
    if(addr.sonOf.length < 3){
      erroredKeys.push('sonOf')
    }
    if(addr.residenceOf.length < 5){
      erroredKeys.push('residenceOf')
    }
  }
  if (addr.type === 'Entity'){
    if(addr.registeredOfficeAddress.length < 5){
      erroredKeys.push('registeredOfficeAddress')
    }
    if(addr.corporateOfficeAddress.length < 5){
      erroredKeys.push('corporateOfficeAddress')
    }
    if(addr.companyType.length < 3){
      erroredKeys.push('companyType')
    }
  }
    return { result: erroredKeys.length === 0, erroredKeys };
};

const cleanAddrObject = (addr, type='truncate') => {
  const newAddr = { ...addr };
  if (newAddr.type === 'Individual') {
    if(type === 'remove') {
      delete newAddr.registeredOfficeAddress;
      delete newAddr.corporateOfficeAddress;
      delete newAddr.companyType;
    }
    if(type === 'truncate'){
      newAddr.corporateOfficeAddress = '';
      newAddr.companyType = '';
      newAddr.registeredOfficeAddress = '';
    }
  }
  if (newAddr.type === 'Entity') {
    if(type === 'remove') {
      delete newAddr.phone;
      delete newAddr.sonOf;
      delete newAddr.residenceOf;
    }
    if(type === 'truncate'){
      newAddr.phone = '';
      newAddr.sonOf = '';
      newAddr.residenceOf = '';
    }
  }
  return newAddr;
};

export const formatTime = (time) => {
  let tempDate = time;
  if(!tempDate) {
    return '-'
  }
  if (!(typeof tempDate.getMonth === 'function')) {
    try{
      tempDate = parseISO(tempDate);
    } catch (e){
      console.log(e);
      tempDate = null;
    }
  }
  if(!tempDate) {
    return '-'
  }
  return format(tempDate, 'hh:mm aa');
};

export const formatDate = (date) => {
  let tempDate = date;
  if(!tempDate) {
    return '-'
  }
  if (!(typeof tempDate.getMonth === 'function')) {
   try{
     tempDate = parseISO(tempDate);
   } catch (e){
     console.log(e);
     tempDate = null;
   }
  }
  if(!tempDate) {
    return '-'
  }
  return format(tempDate, 'dd MMM yyyy');
};

export const taskStatuses = {
  CREATED: 'CREATED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export const isDateObj = (value) => {
  if(!value){
    return false;
  }
  return typeof value.getMonth === 'function';
}

export const existsAndLength = (value) => {
  return value?.length > 3;
};

export const transformFirebaseNotifs = (notifs) => {
  const keys = Object.keys(notifs);
  const arr = [];
  keys.forEach((notifKey) => {
    arr.push({ ...notifs[notifKey], key: notifKey });
  });
  return arr;
};

export const getUploadedFileFromObj = (file) => {
  return ({
    ...file,
    uploadedComplete: true,
    uploadStarted: true
  });
};

export const getValueForInput = (incoming) => {
  let value;
  if(incoming.target){
    if(incoming.target.value !== undefined){
      value = incoming.target.value;
    }
  } else {
    value = incoming;
  }
  return value;
};

export const addressDefaultData = {
  type: 'Individual',
  name: '',
  email: '',
  phone: '',
  sonOf: '',
  residenceOf: '',
  companyType: 'Company',
  registeredOfficeAddress: '',
  corporateOfficeAddress: '',
};

export const isLoading = (value) => value === loadingStates.LOADING;

export const arrayToTextList = (arr) => arr.join(', ');

export const handleFromEmail = (obj) => {
  if (Array.isArray(obj)) {
    return obj;
  }
  return [obj?.email || ''];
};