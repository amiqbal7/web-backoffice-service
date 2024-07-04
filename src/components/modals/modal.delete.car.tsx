import React from 'react';
import { Modal, Button, message } from 'antd';
import axios from 'axios';
import car from '@/assets/car.png';

interface DeleteCarProps {
  visible: boolean;
  onCancel: () => void;
  token: string | null;
  id: number | null;
}

const DeleteCar: React.FC<DeleteCarProps> = ({
  visible,
  onCancel,
  token,
  id,
}) => {
  const onFinish = async () => {
    if (!id) {
      message.error('No car id provided');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Success deleted car.');
      window.location.reload();
    } catch (error) {
      message.error('Failed deleted data car.');
      console.error('Error:', error);
    }
  };

  return (
    <Modal title="" visible={visible} onCancel={onCancel} footer={null}>
      <div className="grid justify-items-center m-8 gap-3 text-center">
        <img src={car} />
        <p>
          Once deleted, car data cannot be recovered. Are you sure you want to
          delete?
        </p>
        <Button type="primary" danger onClick={onFinish}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteCar;
