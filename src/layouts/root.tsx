import { useState, useEffect } from 'react';
import { Outlet, isRouteErrorResponse, useLocation, useNavigate, useRouteError } from 'react-router-dom';
import { App, Button, Result } from 'antd';
import { ProgressBar } from '@/components';

export function Component() {
  const [loading, setLoading] = useState(false);
  const [prevLoc, setPrevLoc] = useState('');
  const location = useLocation();

  useEffect(() => {
    setPrevLoc(location.pathname);
    setLoading(true);
    if(location.pathname===prevLoc){
      setPrevLoc('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    setLoading(false);
  }, [prevLoc]);

  return (
    <App>
      <ProgressBar isAnimating={loading} />
      <Outlet />
    </App>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    console.log('error', error);
    return (
      <Result
        status={500}
        title={error.statusText}
        subTitle={error.data?.message}
        extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
      />
    );
  }

  return (
    <Result
      status={500}
      title={import.meta.env.PROD ? 'Sorry, unexpected error' : 'Unexpected Application Error!'}
      subTitle={import.meta.env.PROD ? 'We are working on fixing the problem' : (error as { message: string }).message as string}
      extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
    />
  );
}
