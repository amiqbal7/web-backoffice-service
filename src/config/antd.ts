import { theme } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import locale from 'antd/locale/id_ID';

export const antdConfig: ConfigProviderProps = {
  locale,
  componentSize: 'middle',
  theme: {
    algorithm: theme.defaultAlgorithm,
    token: {
      // borderRadius: 4,
      // colorLink: '#13a1e4',
      colorPrimary: '#13a1e4',
      // fontSize: 14
    }
  },
  form: {
    requiredMark: 'optional',
    colon: false,
    scrollToFirstError: true,
  },
  virtual: true,
};
