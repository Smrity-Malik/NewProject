import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Select, Text } from '@mantine/core';
import { selectAllWorkspaceUsers } from '../../redux/selectors';

const AvatarRenderer = forwardRef((itemPros, ref) => {
  const {
    email, name, picture, ...others
  } = itemPros;
  return (
    <div ref={ref} {...others}>
      <div className="flex flex-row items-center">
        <div>
          {picture
            ? <Avatar radius="xl" src={picture} />
            : <Avatar radius="xl">{name[0].toUpperCase()}</Avatar> }
        </div>
        <div className="flex flex-col">
          <Text size="sm" className="ml-4">{name}</Text>
          <Text size="xs" className="ml-4">{email}</Text>
        </div>
      </div>
    </div>
  );
});
const UserSelector = ({
  label, onChange: onChangeParent, value, placeholder,
}) => {
  const users = useSelector(selectAllWorkspaceUsers).map(
    (user) => ({ ...user, value: user.email, label: user.email }),
  );
  return (
    <Select
      value={value}
      label={label}
      searchable
      data={users}
      itemComponent={AvatarRenderer}
      filter={(valueIncoming, item) => {
        if (item.name.indexOf(valueIncoming) !== -1) {
          return true;
        }
        return item.email.indexOf(valueIncoming) !== -1;
      }}
      placeholder={placeholder}
      onChange={(valueIn) => {
        onChangeParent({
          target: {
            value: valueIn,
          },
        });
      }}
    />
  );
};
export default UserSelector;
