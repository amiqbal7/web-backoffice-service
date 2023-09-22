import { PageLoading } from '@/components';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { useApi, useAuth } from '@/hooks';
import { currencyFormatIDR } from '@/utils';
import { Order } from '@/types';
import { Card } from 'antd';
import qs from 'qs';
import { ProgressBar } from '@/components/progress';
import { OrderCourierType, OrderType } from '@/enums';

type DataType = Order & {
  created_at: string;
  updated_at: string;
};

export function Component() {
  const { id } = useParams();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [{ data, loading }] = useApi<DataType | null>(
    {
      url: `/orders/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
    { manual: false }
  );

  if (loading) {
    return <PageLoading />;
  } else if (!data) {
    return <Navigate to="/dashboard/orders" />;
  }

  return (
    <>
      <section className="bg-white p-2 shadow-md rounded-md">
        <h1 className="m-2 font-semibold text-xl">
          Detail Order #E3D-0000{data.id}
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card title="User" style={{ background: '#E1EDFD', height: 450 }}>
            <div className="flex gap-3 w-full">
              <div className="grid gap-5">
                <h1>Company name</h1>
                <h1>Email</h1>
                <h1>Address</h1>
                <h1>Phone</h1>
              </div>
              <div className="grid gap-5">
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.company || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.email || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.address || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.phone || '-'}
                </h1>
              </div>
            </div>
          </Card>
          <Card title="Order" style={{ background: '#E1EDFD', height: 450 }}>
            <div className="flex gap-3">
              <div className="grid gap-5">
                <h1>Dicom File</h1>
                <h1>STL File</h1>
                <h1>Type</h1>
                <h1>Catatan</h1>
                <h1>Price</h1>
                <h1>Receipt</h1>
              </div>
              <div className="grid gap-5">
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.dicom || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.stl?.url || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.type && OrderType[data.type]
                    ? OrderType[data.type]
                    : '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.note || '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.price ? currencyFormatIDR(data.price) : '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600 truncate">
                  {data.receipt?.url || '-'}
                </h1>
              </div>
            </div>
          </Card>
          <Card title="Shipping" style={{ background: '#E1EDFD', height: 450 }}>
            <div className="flex gap-3">
              {' '}
              <div className="grid gap-5">
                <h1>Courier</h1>
                <h1>JNT Price</h1>
                <h1>Gosend Price</h1>
                <h1>Tracking Number</h1>
              </div>
              <div className="grid gap-5">
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600">
                  {data.courier_type && OrderCourierType[data.courier_type]
                    ? OrderCourierType[data.courier_type]
                    : '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600">
                  {data.courier_jnt_price
                    ? currencyFormatIDR(data.courier_jnt_price)
                    : '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600">
                  {data.courier_gosend_price
                    ? currencyFormatIDR(data.courier_gosend_price)
                    : '-'}
                </h1>
                <h1 className="bg-white p-2 border-gray-300 border rounded-lg text-gray-600">
                  {data.courier_track_number || '-'}
                </h1>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <ProgressBar />
    </>
  );
}
