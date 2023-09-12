import { Card, Col, Row, Statistic, Typography } from "antd";
import { useAuth, useApi } from "@/hooks";
import CountUp from "react-countup";
import { PageLoading } from "@/components";
import { Navigate, useSearchParams } from "react-router-dom";
import { Summary } from "@/types/summary";
import {
  AiFillBuild,
  AiFillCheckCircle,
  AiFillClockCircle,
  AiFillHdd,
  AiFillProfile,
} from "react-icons/ai";
import { FaTruckMoving } from "react-icons/fa";
import qs from "qs";

type DataType = Summary & {
  summary: Summary;
};

const formatter = (value: number | string) => (
  <CountUp
    end={typeof value === "string" ? parseFloat(value) : value}
    separator=","
  />
);

export function Component() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const params = qs.parse(searchParams.toString());
  const [{ data, loading }] = useApi<DataType>(
    {
      url: "/orders/summary",
      method: "GET",
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
    return <Navigate to="/dashboard/summary" />;
  }

  const statisticsData = [
    {
      title: "Total",
      prefix: <AiFillHdd />,
      color: "#60A5FA",
      text: "white",
      icon: "white",
      dataValue: data.total,
    },
    {
      title: "Konfirmasi Pesanan",
      prefix: <AiFillCheckCircle />,
      color: "white",
      icon: "#60A5FA",
      text: "#495252",
      dataValue: data.confirm,
    },
    {
      title: "Menunggu Pembayaran",
      prefix: <AiFillClockCircle />,
      color: "white",
      icon: "#60A5FA",
      text: "#495252",
      dataValue: data.receipt,
    },
    {
      title: "Proses Pembuatan",
      prefix: <AiFillBuild />,
      color: "white",
      icon: "#60A5FA",
      text: "#495252",
      dataValue: data.build,
    },
    {
      title: "Pengiriman",
      prefix: <FaTruckMoving />,
      color: "white",
      icon: "#60A5FA",
      text: "#495252",
      dataValue: data.delivery,
    },
    {
      title: "Review",
      prefix: <AiFillProfile />,
      icon: "#60A5FA",
      color: "white",
      text: "#495252",
      dataValue: data.review,
    },
  ];

  return (
    <Row gutter={10}>
      {statisticsData.map((statistic, index) => (
        <Col
          span={4}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={4}
          style={{ marginBottom: "20px" }}
          key={index}
        >
          <Card style={{ backgroundColor: statistic.color, height: "210px" }}>
            <Statistic
              style={{ marginTop: "10px", marginBottom: "10px" }}
              title={
                <Typography.Title level={3} style={{ color: statistic.text }}>
                  {statistic.title}
                </Typography.Title>
              }
              value={statistic.dataValue}
              prefix={
                <div
                  className="p-2 rounded-md mr-2 text-2xl"
                  style={{
                    color: statistic.color,
                    backgroundColor: statistic.icon,
                  }}
                >
                  {statistic.prefix}
                </div>
              }
              valueStyle={{
                color: statistic.text,
                fontWeight: "bold",
                fontSize: "40px",
                marginBottom: "10px",
              }}
              formatter={formatter}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
