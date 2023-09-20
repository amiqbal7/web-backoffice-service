import { Button, Progress, Space, Steps } from 'antd';
import { useState } from 'react';

export const ProgressBar = () => {
  const [percent, setPercent] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    'Pemesanan',
    'Konfirmasi Pemesanan',
    'Menunggu Pembayaran',
    'Proses Pembuatan',
    'Pengiriman',
    'Review',
  ];

  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 21;
      if (newPercent > 100) {
        setCurrentStep(steps.length + 1);
        return 100;
      }
      setCurrentStep(currentStep + 1);
      return newPercent;
    });
  };

  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 25;
      if (newPercent < 0) {
        setCurrentStep(0);
        return 0;
      }
      setCurrentStep(currentStep - 1);
      return newPercent;
    });
  };

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

        <Space style={{ margin: 10 }}>
          <Button onClick={decline} type="primary">
            Kembali
          </Button>
          <Button onClick={increase} type="primary">
            Lanjut
          </Button>
        </Space>
      </div>
    </>
  );
};
