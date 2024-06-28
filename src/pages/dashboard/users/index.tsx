import { useSearchParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useApi, useAuth } from '@/hooks';
import { DataTable } from '@/components';
import type { User } from '@/types';
import qs from 'qs';

type DataType = User & {
  created_at: string;
  updated_at: string;
  role: string;
  username: string;
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
      url: '/users/list',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
    { manual: false }
  );
  console.log(data);

  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      key: 'id',
      render: (_row, _data, i) => limit * (page - 1) + (i + 1),
      width: 50,
    },
    {
      title: 'Nama',
      dataIndex: 'username',
      key: 'username',
      render: (_, { username }) => (username ? username : '-'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_, { role }) => (role ? role : '-'),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, { created_at }) => (created_at ? created_at : '-'),
    }
  ];

  return (
    <DataTable<DataType>
      title="Users"
      subtitle="Manage all your existing clients"
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
