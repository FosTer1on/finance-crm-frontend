import { Card, Col, Row, Statistic } from "antd";

import { formatMoney } from "@/utils/formatMoney";

export default function DenXanExpenseSummary({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <Card
      size="small"
      title="Итоги расходов со счёта"
      style={{ marginTop: 16 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Statistic
            title="Общая сумма расходов"
            value={summary.total_amount || 0}
            formatter={(value) => formatMoney(value)}
          />
        </Col>

        <Col xs={24} sm={12}>
          <Statistic
            title="Количество операций"
            value={
              summary.operations_count ??
              summary.payments_count ??
              0
            }
          />
        </Col>
      </Row>
    </Card>
  );
}