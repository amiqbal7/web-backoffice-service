import { useState } from "react";
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
} from "antd";
import { useAuth } from "@/hooks";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { UploadOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { MenuProps } from "antd/lib";

type DataType = {
  name: string;
  price: string;
  startRent: string;
  finishRent: string;
  image_url: File[];
  capacity: string;
  availability: string;
};

interface CreateCarProps {
  visible: boolean;
  onCancel: () => void;
  token: string | null;
  id: number | null;
}

const items: MenuProps["items"] = [
  {
    label: "true",
    key: "true",
    icon: <UserOutlined />,
  },
  {
    label: "false",
    key: "false",
    icon: <UserOutlined />,
  },
];

const itemsCapacity: MenuProps["items"] = [
  {
    label: "2",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "4",
    key: "4",
    icon: <UserOutlined />,
  },
  {
    label: "6",
    key: "6",
    icon: <UserOutlined />,
  },
];

const CreateCar: React.FC<CreateCarProps> = ({ visible, onCancel }) => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [availability, setAvailability] = useState<string>("true");
  const [capacity, setCapacity] = useState<string>("2");

  const onFinish = async (values: DataType) => {
    const startRent = values.startRent
      ? dayjs(values.startRent).toISOString()
      : "";
    const finishRent = values.finishRent
      ? dayjs(values.finishRent).toISOString()
      : "";

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("capacity", capacity);
    formData.append("availability", availability);
    formData.append("startRent", startRent);
    formData.append("finishRent", finishRent);

    if (values.image_url && values.image_url.length > 0) {
      const file = values.image_url[0] as any;
      formData.append("image_url", file.originFileObj);
    } else {
      message.error("Image is required");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cars`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params,
      });

      message.success("Car added successfully.");
      window.location.reload();
    } catch (error) {
      message.error("An error occurred while adding the car.");
    }
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setAvailability(e.key);
  };

  const handleCapacityClick: MenuProps["onClick"] = (e) => {
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
      <Modal
        title="Update Car"
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Input car name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input />
          </Form.Item>
          <div className="flex gap-5">
            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[{ required: false, message: "Please enter a capacity" }]}
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
            <Form.Item
              label="Availability"
              name="availability"
              rules={[{ required: false, message: "Enter a availability" }]}
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
          </div>

          <Form.Item
            label="Start Rent"
            name="startRent"
            rules={[{ required: true, message: "Enter a start rental" }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Finish Rent"
            name="finishRent"
            rules={[{ required: true, message: "Enter a finish rental" }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image_url"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: "Upload image car" }]}
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
