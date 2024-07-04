import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useApi, useAuth } from "@/hooks";
import { PageLoading } from "@/components";
import CreateCar from "@/components/modals/modal.createCar";
import DeleteCar from "@/components/modals/modal.delete.car";
import UpdateCar from "@/components/modals/modal.edit.car";
import { Vendor } from "@/types";
import { Card, Row, Col, Button, Radio } from "antd";
import qs from "qs";
import moment from "moment";
import { IoMdClock, IoMdKey } from "react-icons/io";
import { currencyFormatIDR } from "@/utils";

type DataType = {
  data: (Vendor & {
    created_at: string;
    updated_at: string;
    image_url: string;
    name: string;
    price: number;
    startRent: string;
    finishRent: string;
    id: number;
    category: "small" | "medium" | "large";
    capacity: number;
  })[];
};

export function Component() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [category, setCategory] = useState<
    "small" | "medium" | "large" | "all"
  >("all");

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedCar(null);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    setSelectedCar(null);
  };
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const showDeleteModal = (id: number) => {
    setSelectedCar(id);
    setIsDeleteModalOpen(true);
  };

  const showUpdateModal = (id: number) => {
    setSelectedCar(id);
    setIsUpdateModalOpen(true);
  };

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const [{ data, loading }] = useApi<DataType | null>(
    {
      url: "/cars/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
    { manual: false }
  );

  if (loading) return <PageLoading />;
  if (!data) return <Navigate to="/dashboard/orders" />;

  const filteredCars = data.data.filter((item) => {
    if (category === "all") return true;
    if (category === "small" && item.capacity === 2) return true;
    if (category === "medium" && item.capacity === 4) return true;
    if (category === "large" && item.capacity === 6) return true;
    return false;
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <Radio.Group
          value={category}
          onChange={handleCategoryChange}
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="medium">Medium</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
        <Button type="primary" onClick={() => showCreateModal()}>
          Add Car
        </Button>
      </div>
      <Row gutter={[16, 16]} style={{ paddingTop: "10px" }}>
        {filteredCars.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              style={{ width: "100%" }}
              cover={
                <img
                  alt={item.name}
                  src={item.image_url}
                  className="w-96 h-64 object-cover"
                />
              }
              actions={[
                <div className="flex gap-2 justify-center">
                  <Button
                    type="primary"
                    danger
                    onClick={() => showDeleteModal(item.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => showUpdateModal(item.id)}
                  >
                    Edit
                  </Button>
                </div>,
              ]}
            >
              <div className="grid gap-2">
                <p className="text-lg font-bold">{item.name}</p>
                <p className="text-xl font-bold">
                  {currencyFormatIDR(item.price)} / day
                </p>
                <div className="flex gap-2 items-center">
                  <IoMdKey className="text-lg" />
                  <p className="text-xs">
                    {moment(item.startRent).format("YYYY-MM-DD HH:mm")} -{" "}
                    {moment(item.finishRent).format("YYYY-MM-DD HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2 items-center text-xs">
                  <IoMdClock className="text-lg" />
                  <p>Last Updated:</p>
                  <p>{moment(item.updated_at).format("YYYY-MM-DD HH:mm")}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <DeleteCar
        visible={isDeleteModalOpen}
        onCancel={handleDeleteCancel}
        token={token}
        id={selectedCar}
      />
      <UpdateCar
        visible={isUpdateModalOpen}
        onCancel={handleUpdateCancel}
        token={token}
        id={selectedCar}
      />
      <CreateCar
        visible={isCreateModalOpen}
        onCancel={handleCreateCancel}
        token={token}
        id={selectedCar}
      />
    </div>
  );
}
