// import { Card, Col, Row, Statistic, Typography } from 'antd';
// import { useAuth, useApi } from '@/hooks';
// import CountUp from 'react-countup';
// import { PageLoading } from '@/components';
// import { Navigate, useSearchParams } from 'react-router-dom';
// import {
//   AiFillBuild,
//   AiFillCheckCircle,
//   AiFillClockCircle,
//   AiFillHdd,
//   AiFillProfile,
// } from 'react-icons/ai';
// import { FaTruckMoving } from 'react-icons/fa';
// import qs from 'qs';

// export type DataType = {
//   build: number;
//   confirm: number;
//   review: number;
//   total: number;
//   delivery: number;
//   receipt: number;
//   complete: number;
// };
// const formatter = (value: number | string) => (
//   <CountUp
//     end={typeof value === 'string' ? parseFloat(value) : value}
//     separator=","
//   />
// );

// export function Component() {
//   const { token } = useAuth();
//   const [searchParams] = useSearchParams();
//   const params = qs.parse(searchParams.toString());
//   const [{ data, loading }] = useApi<DataType>(
//     {
//       url: '/orders/summary',
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params,
//     },
//     { manual: false }
//   );
//   console.log(data);

//   if (loading) {
//     return <PageLoading />;
//   } else if (!data) {
//     return <Navigate to="/dashboard/summary" />;
//   }

//   const statisticsData = [
//     {
//       title: 'Total',
//       prefix: <AiFillHdd />,
//       color: '#60A5FA',
//       text: 'white',
//       icon: 'white',
//       dataValue: data.total,
//     },
//     {
//       title: 'Konfirmasi Pesanan',
//       prefix: <AiFillCheckCircle />,
//       color: 'white',
//       icon: '#60A5FA',
//       text: '#495252',
//       dataValue: data.confirm,
//     },
//     {
//       title: 'Menunggu Pembayaran',
//       prefix: <AiFillClockCircle />,
//       color: 'white',
//       icon: '#60A5FA',
//       text: '#495252',
//       dataValue: data.receipt,
//     },
//     {
//       title: 'Proses Pembuatan',
//       prefix: <AiFillBuild />,
//       color: 'white',
//       icon: '#60A5FA',
//       text: '#495252',
//       dataValue: data.build,
//     },
//     {
//       title: 'Pengiriman',
//       prefix: <FaTruckMoving />,
//       color: 'white',
//       icon: '#60A5FA',
//       text: '#495252',
//       dataValue: data.delivery,
//     },
//     {
//       title: 'Review',
//       prefix: <AiFillProfile />,
//       icon: '#60A5FA',
//       color: 'white',
//       text: '#495252',
//       dataValue: data.complete,
//     },
//   ];

//   return (
//     <Row gutter={10}>
//       {statisticsData.map((statistic, index) => (
//         <Col
//           span={4}
//           xs={24}
//           sm={12}
//           md={8}
//           lg={6}
//           xl={4}
//           style={{ marginBottom: '20px' }}
//           key={index}
//         >
//           <Card style={{ backgroundColor: statistic.color, height: '210px' }}>
//             <Statistic
//               style={{ marginTop: '10px', marginBottom: '10px' }}
//               title={
//                 <Typography.Title level={5} style={{ color: statistic.text }}>
//                   {statistic.title}
//                 </Typography.Title>
//               }
//               value={statistic.dataValue}
//               prefix={
//                 <div
//                   className="p-2 rounded-md mr-2 text-2xl"
//                   style={{
//                     color: statistic.color,
//                     backgroundColor: statistic.icon,
//                   }}
//                 >
//                   {statistic.prefix}
//                 </div>
//               }
//               valueStyle={{
//                 color: statistic.text,
//                 fontWeight: 'bold',
//                 fontSize: '40px',
//                 marginBottom: '10px',
//               }}
//               formatter={formatter}
//             />
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// }

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
        moment(startRent).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'finishRent',
      title: 'Finish rent',
      render: (_, { finishRent }) =>
        moment(finishRent).format('YYYY-MM-DD HH:mm:ss'),
    },
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
