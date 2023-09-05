import { useLogin } from '@/hooks';
import { Alert, Button, Form, Input } from 'antd';

interface FormValues {
  email: string;
  password: string;
}

export function Component() {
  const { login, loading, error } = useLogin();
  const onFinish = async (values: FormValues) => {
    await login(values);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold"> Masuk </h3>
      <p className="text-lg mb-3 text-gray-500"> to access the dashboard </p>

      {error && <Alert message={error?.response?.data.message} type="error" showIcon className='!mb-3' />}

      <Form
        name="login"
        initialValues={{ email: '', password: '' }}
        onFinish={onFinish}
        autoComplete="off"
        layout='vertical'
      >
        <Form.Item
          label="Email"
          name="email"
          required
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type='email' autoComplete="off" disabled={loading} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password autoComplete="off" disabled={loading} />
        </Form.Item>

        <Form.Item className='!mb-0'>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
