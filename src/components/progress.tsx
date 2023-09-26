import { useAuth } from '@/hooks';
import { Progress, Space, Steps } from 'antd';
import { useState, useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Order } from '@/types';
import qs from 'qs';
import { useApi } from '@/hooks';
import { PageLoading } from '@/components';

type DataType = Order & {
  created_at: string;
  updated_at: string;
};

const steps = [
  'Konfirmasi',
  'Pembayaran',
  'Pembuatan',
  'Pengiriman',
  'Review',
  'Complete',
];

export const ProgressBar = () => {
  const [percent, setPercent] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { id } = useParams();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [{ data, loading }] = useApi<DataType | null>(
    {
      url: `/orders/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
    { manual: false }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const status = data.status;
    let newPercent = percent;

    if (status === 'cancel') {
      setCurrentStep(currentStep - 1);
    } else if (status === 'pending') {
      newPercent += 2;
      setCurrentStep(currentStep + 0);
    } else if (status === 'confirm') {
      newPercent += 6;
      setCurrentStep(currentStep + 0.5);
    } else if (status === 'receipt') {
      setCurrentStep(currentStep + 0.5);
      newPercent += 11;
    } else if (status === 'build') {
      setCurrentStep(currentStep + 1);
      newPercent += 21;
    } else if (status === 'delivery') {
      setCurrentStep(currentStep + 1.5);
      newPercent = 60;
    } else if (status === 'review') {
      setCurrentStep(currentStep + 2);
      newPercent += 40;
    } else if (status === 'complete') {
      setCurrentStep(currentStep + 6);
      newPercent += 100;
    }
    setPercent(newPercent);
  }, [data]);

  if (loading) {
    return <PageLoading />;
  } else if (!data) {
    return <Navigate to="/dashboard/orders" />;
  }

  return (
    <>
      <div className="bg-white mt-3 w-full rounded-md shadow-md">
        <div style={{ margin: 10, padding: 10 }}>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor={{ from: '#E1EDFD', to: '#108ee9' }}
          />
        </div>
        <Steps
          current={currentStep}
          direction="horizontal"
          labelPlacement="vertical"
          style={{ margin: 10 }}
          items={steps.map((stepTitle) => ({
            title: stepTitle,
          }))}
        ></Steps>

        <Space style={{ margin: 10 }}></Space>
      </div>
    </>
  );
};
