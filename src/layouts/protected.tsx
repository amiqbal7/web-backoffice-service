import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Layout, Spin } from 'antd';
import { MdDashboard, MdLogout, MdPerson } from 'react-icons/md';
import { useApi, useAuth, useLogout } from '@/hooks';
import logo from '@/assets/binar.png';
import { User } from '@/types';

type DataType = User & {
  created_at: string;
  updated_at: string;
  price: number;
  availability: boolean;
  startRent: string;
  finishRent: string;
  username: string;
  capacity: number;
};

export function Component() {
  const { isAuthenticated, token } = useAuth();
  const { logout, loading } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [{ data }] = useApi<{
    data: DataType;
  }>(
    {
      url: '/users/auth/whoami',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { manual: false }
  );

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout className='h-full absolute w-full overflow-hidden top-0 left-0'>
      <Layout.Header
        className='!flex-none !bg-white flex justify-between !h-14 items-center !px-4 border-b'
      >
        <Link to='/' className="flex items-center !text-inherit">
          <img src={logo} className="h-6 mr-2" alt="Logo" />
          <h1 className="text-lg font-bold">
            {import.meta.env.VITE_APP_TITLE}
          </h1>
        </Link>
        <div>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'dashboard',
                  icon: <MdDashboard />,
                  label: 'Dashboard',
                  onClick: () => {
                    navigate('/dashboard');
                  },
                },
                {
                  key: 'profile',
                  icon: <MdPerson />,
                  label: 'Profile',
                  onClick: () => {
                    navigate('/profile/info');
                  },
                },
                {
                  key: 'logout',
                  icon: <MdLogout />,
                  label: 'Logout',
                  onClick: async () => {
                    await logout();
                    navigate('/login');
                  },
                },
              ]
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" className='!px-2 !flex items-center'>
              <Avatar
                size="small"
                className='!bg-primary-100 !text-primary-500 !flex justify-center items-center'
                icon={<MdPerson />}
              />
              <span className='ml-2'>
                {data?.data?.username ?? 'User'}
              </span>
            </Button>
          </Dropdown>
        </div>
      </Layout.Header>
      <Layout.Content className='flex-1 overflow-auto'>
        <Spin spinning={loading} tip="Loading" wrapperClassName='h-full w-full' size="large">
          <Outlet />
        </Spin>
      </Layout.Content>
    </Layout>
  );
}
