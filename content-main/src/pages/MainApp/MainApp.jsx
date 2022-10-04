import React, { useState } from 'react';
import {
  AppShell, Header, Navbar, ActionIcon,
} from '@mantine/core';
import {
  Notes, Home, Paperclip,
  Bell, BarrierBlock, Template,
  LayoutSidebarLeftCollapse, LayoutSidebarRightCollapse, Snowman, ReportMoney,
} from 'tabler-icons-react';
import { LinksGroup } from '../../components/NavbarLinkGroup';
import AppHeader from '../../components/Header/AppHeader';

const MainApp = ({ appContent }) => {
  const mockdata = [
    {
      label: 'Dashboard',
      icon: Home,
      link: '/app',
    },
    {
      label: 'Notifications',
      icon: Bell,
      link: '/app/notifications',
    },
    {
      label: 'Dispute Managaer',
      icon: Notes,
      initiallyOpened: true,
      links: [
        { label: 'Legal Notices', link: '/app/dispute-manager/legal-notices' },
        { label: 'Cases', link: '/app/dispute-manager/cases' },
      ],
    },
    {
      label: 'Agreements',
      icon: Paperclip,
      link: '/app/agreements',
    },
    {
      label: 'Templates',
      icon: Template,
      link: '/app/templates',
    },
    {
      label: 'Service Providers',
      icon: Snowman,
      link: '/app/service-providers',
    },
    {
      label: 'Budget Manager',
      icon: ReportMoney,
      link: '/app/budget-manager',
    },
    {
      label: 'For development',
      icon: BarrierBlock,
      initiallyOpened: false,
      links: [
        {
          label: 'Dashboard Old',
          icon: Home,
          link: '/app-old',
        },
        {
          label: 'New Mock Page',
          icon: Home,
          link: '/app/case-new-form',
        },
      ],
    },
  ];

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AppShell
      padding="md"
      navbar={(
        <Navbar
          style={{ backgroundColor: '#F1F4FA' }}
          width={{ base: sidebarCollapsed ? 50 : 300 }}
          height="calc(100vh - 65px)"
          p="xs"
        >
          <div className="flex flex-col">
            <div className="flex justify-end">
              <ActionIcon color="blue" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                {sidebarCollapsed
                  ? <LayoutSidebarRightCollapse />
                  : <LayoutSidebarLeftCollapse />}
              </ActionIcon>
            </div>
            {!sidebarCollapsed && <div>{links}</div>}
          </div>
        </Navbar>
          )}
      header={<Header height={65}><AppHeader /></Header>}
    >
      <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 100px)' }}>
        {appContent}
      </div>

    </AppShell>
  );
};

export default MainApp;
