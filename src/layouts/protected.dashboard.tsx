import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Menu } from 'antd';
import { MdDashboard, MdManageAccounts, MdOutlineListAlt, MdSupervisorAccount } from 'react-icons/md';
import lodash from 'lodash';

interface MenuItem {
  key: React.Key;
  icon?: React.ReactNode;
  label: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[]
}

export function Component() {
  const navigate = useNavigate();
  const location = useLocation();
  const items: MenuItem[] = [
    {
      key: '/dashboard/summary',
      icon: <MdDashboard />,
      label: 'Ringkasan',
    },
    {
      key: '/dashboard/users',
      icon: <MdManageAccounts />,
      label: 'Users',
    },
    // {
    //   key: '/dashboard/vendors',
    //   icon: <MdCorporateFare />,
    //   label: 'Vendors',
    // },
    {
      key: '/dashboard/cars',
      icon: <MdSupervisorAccount />,
      label: 'Cars',
    },
    {
      key: '/dashboard/orders',
      icon: <MdOutlineListAlt />,
      label: 'Orders',
    },
  ];
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const item = lodash(items)
      .thru((coll) => lodash.union(coll, lodash.flatten(lodash.map(coll, (col) => col?.children || []))))
      .flatten()
      .find({ key: url });

    return {
      key: url,
      title: item ? item.label : null,
    };
  });
  const breadcrumbItems = [
    {
      title: <Link to="/">Dashboard</Link>,
      key: 'dashboard',
    },
    ...extraBreadcrumbItems.filter(x => !!x.title).map((item) => ({
      key: item.key,
      title: <Link to={item.key}>{item.title}</Link>
    })),
  ];

  return (
    <Layout hasSider className='overflow-hidden h-full'>
      <Layout.Sider
        className='h-full overflow-auto px-2'
        breakpoint="lg"
        theme='light'
        collapsedWidth={64}
        width={256}
      >
        <Menu
          mode="inline"
          className='w-[256px] !border-0'
          items={items}
          defaultSelectedKeys={lodash.map(extraBreadcrumbItems, 'key')}
          defaultOpenKeys={lodash.map(extraBreadcrumbItems, 'key')}
          onSelect={(info) => {
            navigate(info.key);
          }}
        />
      </Layout.Sider>
      <Layout.Content className='overflow-auto p-4' id="main-content">
        <div className='flex justify-between mb-4'>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
