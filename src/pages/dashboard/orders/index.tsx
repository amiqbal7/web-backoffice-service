import { useSearchParams, Link } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useApi, useAuth } from '@/hooks';
import { OrderType, OrderStatus } from '@/enums';
import { DataTable } from '@/components';
import type { Order, User } from '@/types';
import moment from 'moment';
import qs from 'qs';
import { currencyFormatIDR } from '@/utils';
import { Button } from 'antd';

type DataType = Order & {
  user: User;
  created_at: string;
  updated_at: string;
};

export function Component() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const limit = Number(params.limit ?? 10);
  const page = Number(params.page ?? 1);
  const [{ data, loading }] = useApi<{
    data: DataType[];
    meta: {
      total: number;
      per_page: number;
      current_page: number;
    };
  }>(
    {
      url: '/orders',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
    { manual: false }
  );
  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      key: 'id',
      render: (_row, _data, i) => limit * (page - 1) + (i + 1),
      width: 50,
    },
    {
      title: 'Nama Perusahaan',
      dataIndex: 'name',
      key: 'name',
      render: (_, { company }) => (company ? company : '-'),
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (_, { uuid }) => (uuid ? uuid : '-'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (_, { created_at }) =>
        moment(created_at).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'type',
      title: 'Type Order',
      render: (_, { type }) => OrderType[type],
    },
    {
      key: 'price',
      title: 'Total Harga',
      render: (_, { price }) => (price ? currencyFormatIDR(price) : '-'),
    },
    {
      key: 'progress',
      title: 'Progress',
      render: (_, { status }) => OrderStatus[status],
    },
    {
      key: 'action',
      title: 'Action',
      dataIndex: 'action',
      render: (_, data) => (
        <Link to={`/dashboard/orders/${data.id}`}>
          <Button type="primary">Detail</Button>
        </Link>
      ),
    },
  ];

  return (
    <DataTable<DataType>
      title="Orders"
      subtitle="Manage all your existing orders"
      rowKey="id"
      columns={columns}
      data={data?.data ?? []}
      loading={loading}
      pagination={{
        page: page,
        pageSize: limit,
        total: data?.meta.total ?? 0,
      }}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  );
}
