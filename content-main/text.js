const axios = require('axios');
const fs = require('fs');
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const run = async () => {

    const res = await axios.put()

  console.log('Sending file to S3...');
  const resp = await fetch('https://tcdoc.s3.amazonaws.com/8080503d-7ce5-4711-92a3-d2e6e6733762-tc-pat1aa.pdf?AWSAccessKeyId=AKIA5UF5X7HHD25VO4HW&Signature=OkqzKp%2BeuyUJHuu4Q5V1HRTLVlw%3D&Expires=1649683895', {
    method: 'PUT',
    body: 'aaa',
    headers: {
      'content-length': 3,
    },
  }).catch((err) => {
    console.log(err);
    return null;
  });
  // console.log('Sending file to S3...');
  // const resp = await axios('https://tcdoc.s3.amazonaws.com/4a0ce6e3-5d3b-4172-a376-3ca59063aa15-tc-patanjaliaa.pdf?AWSAccessKeyId=AKIA5UF5X7HHD25VO4HW&Signature=g23mrfR3iz0JDfYcKbuB5snX2Io%3D&Expires=1649683228', {
  //   method: 'PUT',
  //   body: 'monu',
  //   headers: {
  //     'Content-Type': 'image/jpeg',
  //   },
  //   transformRequest: [
  //     (data, headers) => {
  //       delete headers.common;
  //       return data;
  //     },
  //   ],
  // }).catch((err) => {
  //   console.log(err);
  //   return null;
  // });
  console.log(resp);
};
run();
