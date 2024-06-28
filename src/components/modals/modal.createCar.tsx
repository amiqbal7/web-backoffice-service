import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Upload,
  Dropdown,
  Space,
} from 'antd';
import { useAuth } from '@/hooks';
import { useSearchParams } from 'react-router-dom';
import qs from 'qs';
import { UploadOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { MenuProps } from 'antd/lib';

type DataType = {
  name: string;
  price: string;
  startRent: string;
  finishRent: string;
  image_url: File;
  capacity: string;
  availability: string;
};

const items: MenuProps['items'] = [
  {
    label: 'true',
    key: 'true',
    icon: <UserOutlined />,
  },
  {
    label: 'false',
    key: 'false',
    icon: <UserOutlined />,
  },
];

const itemsCapacity: MenuProps['items'] = [
  {
    label: '2',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: '4',
    key: '4',
    icon: <UserOutlined />,
  },
  {
    label: '6',
    key: '6',
    icon: <UserOutlined />,
  },
];

const CreateCar = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [availability, setAvailability] = useState<string>('true');
  const [capacity, setCapacity] = useState<string>('');

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = async (values: DataType) => {
    const startRent = values.startRent
      ? dayjs(values.startRent).toISOString()
      : '';
    const finishRent = values.finishRent
      ? dayjs(values.finishRent).toISOString()
      : '';

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('capacity', values.capacity);
    formData.append('availability', availability);
    formData.append('startRent', startRent);
    formData.append('finishRent', finishRent);

    if (values.image_url && values.image_url.file) {
      formData.append('image_url', values.image_url.file);
    } else {
      message.error('Image is required');
      return;
    }

    try {
      await axios.post('http://localhost:3000/cars', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        params,
      });

      message.success('Car added successfully.');
      window.location.reload();
    } catch (error) {
      message.error('An error occurred while adding the car.');
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setAvailability(e.key);
  };

  const handleCapacityClick: MenuProps['onClick'] = (e) => {
    setCapacity(e.key);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const menuPropsCapacity = {
    items: itemsCapacity,
    onClick: handleCapacityClick,
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Car
      </Button>
      <Modal
        title="Add Car"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={onFinish}>
          <h1 className="font-semibold text-xl pb-5">Add Car</h1>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the car name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: 'Please enter the car price',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Capacity"
            name="capacity"
          >
            <Dropdown menu={menuPropsCapacity}>
              <Button>
                <Space>
                  {capacity}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>
          <Form.Item label="Availability" name="availability">
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  {availability}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>
          <Form.Item label="Start Rent" name="startRent">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Finish Rent" name="finishRent">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image_url"
            rules={[
              {
                required: true,
                message: 'Please upload an image of the car',
              },
            ]}
          >
            <Upload
              name="image_url"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateCar;
