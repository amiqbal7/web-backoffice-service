import { Card, Col, Row, Statistic } from 'antd';
import { MdPercent } from 'react-icons/md';

export function Component() {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic title="Feedback" value={1128} prefix={<MdPercent />} />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic title="Unmerged" value={93} suffix="/ 100" />
        </Card>
      </Col>
    </Row>
  );
}
