import React from 'react';
import { Box, Text } from '@mantine/core';

const AddressRender = ({ addr, onClick, selected }) => (
  <Box
    onClick={onClick || (() => {})}
    className={'border-gray-100 bg-gray-100 rounded-xl my-2 p-4 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
            + `${selected ? ' border-2 border-blue-200 bg-blue-50' : ''}`}
  >
    {addr.type === 'Individual'
            && (
            <div className="flex flex-col">
              <Text size="sm">{addr.name}</Text>
              <Text size="xs" color="gray">
                S/O:
                {' '}
                <span>{addr.name}</span>
              </Text>
              <Text size="sm">
                {addr.residenceOf}
              </Text>
              <Text size="sm">
                {addr.phone}
              </Text>
              <Text size="sm">
                {addr.email}
              </Text>
            </div>
            )}
    {addr.type === 'Entity'
            && (
            <div className="flex flex-col">
              <Text size="sm">{addr.name}</Text>
              <Text size="xs" color="gray">
                Company Type :
                <span>{addr.companyType}</span>
              </Text>
              <Text size="sm">
                {addr.registeredOfficeAddress}
              </Text>
              <Text size="sm">
                {addr.corporateOfficeAddress}
              </Text>
              <Text size="sm">
                {addr.email}
              </Text>
            </div>
            )}
  </Box>
);

export default AddressRender;
