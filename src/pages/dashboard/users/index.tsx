import { useSearchParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useApi, useAuth } from '@/hooks';
import { DataTable } from '@/components';
import type { User } from '@/types';
import moment from 'moment';
import qs from 'qs';

type DataType = User & {
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
    },
  }>({
    url: '/users',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    params,
  }, { manual: false });
  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      key: 'id',
      render: (_row, _data, i) => (limit * (page-1))+(i+1),
      width: 50,
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nomor telepon',
      dataIndex: 'phone',
      key: 'name',
      render: (_, { phone }) => phone ? phone : '-',
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'gender',
      key: 'gender',
      render: (_, { gender }) => {
        switch (gender) {
          case 'male':
            return 'Laki - Laki';
          case 'female':
            return 'Perempuan';
          default:
            return '-';
        }
      },
      filters: [
        {
          text: 'Laki - Laki',
          value: 'male',
        },
        {
          text: 'Perempuan',
          value: 'female',
        },
      ]
    },
    {
      key: 'height',
      title: 'Tinggi Badan',
      dataIndex: 'height',
      render: (_, { height }) => height ? `${height} cm` : '-',
    },
    {
      key: 'age',
      title: 'Umur',
      dataIndex: 'age',
      render: (_, { age }) => age ? `${age} tahun` : '-',
    },
    {
      key: 'created_at',
      title: 'Tanggal Register',
      dataIndex: 'created_at',
      render: (_, { created_at }) => moment(created_at).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
  ];

  return (
    <DataTable<DataType>
      title='Users'
      subtitle='Manage all your existing clients'
      rowKey='id'
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
