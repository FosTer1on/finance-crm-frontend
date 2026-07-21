import { Card, Col, Empty, Row, Statistic, Tag, Typography } from "antd";

import { formatMoney } from "@/shared/utils/formatMoney";

const { Text } = Typography;

export default function DenXanExpenseGroups({ groups = [] }) {
  return (
    <Card
      size="small"
      title="Расходы по категориям"
      style={{ marginTop: 16 }}
    >
      {groups.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="За выбранный период расходов нет"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {groups.map((group) => (
            <Col
              key={group.keyword}
              xs={24}
              sm={12}
              lg={8}
              xl={6}
            >
              <Card size="small" style={{ height: "100%" }}>
                <Statistic
                  title={group.display_name}
                  value={group.total_amount || 0}
                  formatter={(value) => formatMoney(value)}
                />

                <Text type="secondary">
                  Операций:{" "}
                  <Tag style={{ marginInlineStart: 4 }}>
                    {group.operations_count || 0}
                  </Tag>
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
}