import { Avatar, Text } from '@mantine/core';
import React from 'react';

const UserAvatarView = ({ picture, name, email }) => (
  <div className="flex">
    <div>
      {picture
        ? <Avatar radius="xl" src={picture} />
        : <Avatar radius="xl">{name[0].toUpperCase()}</Avatar> }
    </div>
    <div className="flex flex-col ml-1">
      <Text size="sm">{name}</Text>
      <Text size="xs" color="gray">{email}</Text>
    </div>
  </div>
);

export default UserAvatarView;
