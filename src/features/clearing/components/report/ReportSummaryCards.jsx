import { Card, Col, Row, Statistic, Typography } from "antd";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../../utils/formatCurrency";

const { Text } = Typography;

const items = [
  {
    key: "incoming_total",
    title: "Общая сумма прихода",
  },
  {
    key: "incoming_commission_total",
    title: "Комиссия прихода",
  },
  {
    key: "amount_to_give_total",
    usdKey: "amount_to_give_usd_total",
    title: "К выдаче",
  },
  {
    key: "outgoing_commission_total",
    title: "Комиссия получения",
  },
  {
    key: "amount_to_receive_total",
    usdKey: "amount_to_receive_usd_total",
    title: "К получению",
  },
  {
    key: "profit_uzs",
    usdKey: "profit_usd",
    title: "Прибыль",
    isResult: true,
  },
];

export default function ReportSummaryCards({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => {
        const value = summary[item.key] || 0;
        const isLoss = item.isResult && Number(value) < 0;

        return (
          <Col key={item.key} xs={24} sm={12} lg={8} xl={6}>
            <Card size="small" style={{ height: "100%" }}>
              <Statistic
                title={isLoss ? "Убыток" : item.title}
                value={value}
                formatter={(currentValue) => formatMoney(currentValue)}
              />

              {item.usdKey && (
                <Text
                  type={isLoss ? "danger" : "secondary"}
                  strong={item.isResult}
                >
                  {formatUsd(summary[item.usdKey])}
                </Text>
              )}
            </Card>
          </Col>
        );
      })}

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small" style={{ height: "100%" }}>
          <Statistic
            title="Количество операций"
            value={summary.operations_count || 0}
          />
        </Card>
      </Col>
    </Row>
  );
}
