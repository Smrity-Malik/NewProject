/* eslint-disable */
import React, { useState } from 'react';
import { Avatar, Menu, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AppHeader.module.css';
import { assetsPrefix } from '../../utilities/utilities';
import { selectUserData } from '../../redux/selectors';
import { DoorExit } from 'tabler-icons-react';
import { deleteCookie, getCookiesSession } from '../../cookiesSession';

const AppHeader = () => {
  const userData = useSelector(selectUserData);
  const [opened, setOpened] = useState(false);

  const logoutHandler = () => {
      if (getCookiesSession('trueCounselUserData')) {
          deleteCookie('trueCounselUserData');
      }
      window.location = process.env.REACT_APP_LANDING_PAGE_URL;
  };
  return (
    <div className="flex flex-row justify-between mx-8 my-2">
      <img className={styles.logo} src={`${assetsPrefix}/images/trueCounselLogo.svg`} alt="TrueCounsel" />
      <Menu>
          <Menu.Target>
              <div onClick={() => { setOpened(!opened) }} className="flex items-center cursor-pointer">
                  {userData.picture?.length ? <Avatar size="md" src={userData.picture} radius="xl" />
                      : <Avatar size="md" radius="xl">{userData.name[0].toUpperCase()}</Avatar>}
                  <div className="ml-2 flex flex-col">
                      <Text size="md">{userData.name}</Text>
                      <Text size="xs">{userData.email}</Text>
                  </div>
              </div>
          </Menu.Target>
          <Menu.Dropdown>
              <Menu.Item onClick={logoutHandler} icon={<DoorExit size={14} />}>Logout</Menu.Item>
          </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default AppHeader;
