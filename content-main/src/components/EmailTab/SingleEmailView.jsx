import React from 'react';
import {
  Accordion,
  Badge,
  Text,
} from '@mantine/core';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import {
  arrayToTextList, formatDate, formatTime, handleFromEmail,
} from '../../utilities/utilities';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';

const SingleEmailView = ({ email }) => {
  const multiUploadArgs = useMultiFileUpload({
    loadFromParent: false,
    existingFiles: email.attachments || [],
  });

  return (
    <div className="ml-2 border-solid border-blue-100 rounded w-full mt-6">
      <div className="flex flex-col p-4">
        <div className="flex justify-between">
          <div className="flex flex-col justify-start items-start">
            <Text color="gray" size="sm" className="mb-2">
              To:
              {' '}
              {arrayToTextList(email.to || [])}
            </Text>

            <Text color="gray" size="sm" className="mb-2">
              From:
              {' '}
              {arrayToTextList(handleFromEmail(email.from) || [])}
            </Text>

            <Text color="gray" size="sm" className="mb-2">
              CC:
              {' '}
              {arrayToTextList(email.cc || [])}
            </Text>
          </div>
          <div className="flex flex-col">
            <Badge size="lg" color={email.direction === 'incoming' ? 'cyan' : 'green'} className="mb-2">{email.direction}</Badge>
            <Text color="gray" size="sm">
              {`${formatDate(email.createdAt)}, ${formatTime(email.createdAt)}`}
            </Text>
          </div>
        </div>
        <div className="flex">
          <Text color="gray">Subject:</Text>
          <Text className="ml-2">{email.subject}</Text>
        </div>
        <Accordion defaultValue="close">
          <Accordion.Item value="open">
            <Accordion.Control>
              <Text color="green" size="sm">View email Content</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-4" dangerouslySetInnerHTML={{ __html: email.body }} />

            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div className="mt-4 flex flex-col">
          <Text className="mb-2">Attachements</Text>
          <NewDocumentUploader
            hideDropZone
            hideDeleteButton
            multiUploadArgs={multiUploadArgs}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleEmailView;
