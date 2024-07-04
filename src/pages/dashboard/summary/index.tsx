import { useSearchParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useApi, useAuth } from '@/hooks';
import { DataTable } from '@/components';
import type { User } from '@/types';
import qs from 'qs';
import moment from 'moment';
import { currencyFormatIDR } from '@/utils';

type DataType = User & {
  created_at: string;
  updated_at: string;
  price: number;
  availability: boolean;
  startRent: string;
  finishRent: string;
  capacity: number;
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
      url: '/cars/list',
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
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
      render: (_, { name }) => (name ? name : '-'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, { price }) => (price ? currencyFormatIDR(price) : '-'),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (_, { capacity }) => (capacity ? capacity : '-'),
    },
    {
      key: 'availability',
      title: 'Availability',
      dataIndex: 'availability',
      render: (_, { availability }) =>
        availability ? 'Available' : 'Not Available',
    },
    {
      key: 'startRent',
      title: 'Start rent',
      dataIndex: 'startRent',
      render: (_, { startRent }) =>
        moment(startRent).format('YYYY-MM-DD HH:mm'),
    },
    {
      key: 'finishRent',
      title: 'Finish rent',
      render: (_, { finishRent }) =>
        moment(finishRent).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <DataTable<DataType>
      title="Cars Data"
      subtitle="Manage all your existing cars"
      rowKey="id"
      columns={columns}
      data={data?.data ?? []}
      loading={loading}
      pagination={{
        page: page,
        pageSize: limit,
      }}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  );
}
