import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { antdConfig } from '@/config';
import { PageLoading } from '@/components';
import router from '@/router';
import moment from 'moment';

moment.locale('id');

export default function App () {
  return (
    <HelmetProvider>
      <ConfigProvider {...antdConfig}>
        <StyleProvider hashPriority="high">
          <RouterProvider router={router} fallbackElement={<PageLoading />} />
        </StyleProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}

