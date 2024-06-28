import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Form, Input, DatePicker, Upload, Dropdown, Space, MenuProps } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { UploadOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';

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
  }
];

interface EditCarProps {
  visible: boolean;
  onCancel: () => void;
  token: string | null;
  id: number | null;
}

type DataType = {
  name: string;
  price: string;
  startRent: string | null;
  finishRent: string | null;
  image_url: File[];
  availability: string;
};

const EditCar: React.FC<EditCarProps> = ({ visible, onCancel, token, id }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<DataType | undefined>(undefined);
  const [availability, setAvailability] = useState<string>('true');

  useEffect(() => {
    if (id) {
      const fetchCarData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/cars/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const carData = response.data;

          // Set initial values from the fetched data
          setInitialValues({
            name: carData.name,
            price: carData.price,
            availability: carData.availability,
            startRent: carData.startRent ? dayjs(carData.startRent) : null,
            finishRent: carData.finishRent ? dayjs(carData.finishRent) : null,
            image_url: carData.image_url ? [{ url: carData.image_url, name: 'Car Image' }] : [],
          });



          // Set form values
          form.setFieldsValue({
            name: carData.name,
            price: carData.price,
            startRent: carData.startRent ? dayjs(carData.startRent) : undefined,
            finishRent: carData.finishRent ? dayjs(carData.finishRent) : undefined,
            image_url: carData.image_url ? [{ url: carData.image_url, name: 'Car Image' }] : [],
          });
        } catch (error) {
          message.error('Failed to fetch car data');
        }
      };

      fetchCarData();
    }
  }, [id, token, form]);

  const onFinish = async (values: DataType) => {
    const startRent = dayjs(values.startRent).toISOString();
    const finishRent = dayjs(values.finishRent).toISOString();

    if (!id) {
      message.error('No car id provided');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('availability', availability);
    formData.append('startRent', startRent);
    formData.append('finishRent', finishRent);

    if (values.image_url && values.image_url.length > 0 && values.image_url[0].originFileObj) {
      formData.append('image_url', values.image_url[0].originFileObj);
    }

    try {
      await axios.put(`http://localhost:3000/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Car updated successfully');
      window.location.reload();
    } catch (error) {
      message.error('Failed to update car');
      console.error('Error:', error);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setAvailability(e.key);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Modal
      title="Update Car"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {initialValues && (
        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Input car name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: false, message: 'Please enter a price' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: false, message: 'Please enter a capacity' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Rent"
            name="startRent"
            rules={[{ required: false, message: 'Enter a start rental' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Availability"
            name="availability"
            rules={[{ required: false, message: 'Enter a availability' }]}
          >
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  {availability}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>
          <Form.Item
            label="Finish Rent"
            name="finishRent"
            rules={[{ required: false, message: 'Enter a finish rental' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image_url"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: false, message: 'Upload image car' }]}
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
      )}
    </Modal>
  );
};

export default EditCar;
