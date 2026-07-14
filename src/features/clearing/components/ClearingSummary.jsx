import { Alert, Card, Col, Row, Statistic } from "antd";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../utils/formatCurrency";

export default function ClearingSummary({ summary }) {
  if (!summary) return null;

  const items = [
    {
      key: "incoming_total",
      title: "Общая сумма прихода",
      type: "uzs",
    },
    {
      key: "incoming_commission_total",
      title: "Комиссия прихода",
      type: "uzs",
    },
    {
      key: "amount_to_give_total",
      usdKey: "amount_to_give_usd_total",
      title: "К выдаче",
      type: "both",
    },
    {
      key: "outgoing_commission_total",
      title: "Комиссия получения",
      type: "uzs",
    },
    {
      key: "amount_to_receive_total",
      usdKey: "amount_to_receive_usd_total",
      title: "К получению",
      type: "both",
    },
    {
      key: "profit_uzs",
      usdKey: "profit_usd",
      title: "Прибыль",
      type: "both",
    },
  ];

  return (
    <Card size="small" title="Итоги" style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} xs={24} sm={12} lg={8} xl={6}>
            <Card size="small" style={{ height: "100%" }}>
              <Statistic
                title={item.title}
                value={summary[item.key] || 0}
                formatter={(value) => formatMoney(value)}
              />

              {item.type === "both" && (
                <strong>{formatUsd(summary[item.usdKey])}</strong>
              )}
            </Card>
          </Col>
        ))}

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card size="small" style={{ height: "100%" }}>
            <Statistic
              title="Количество операций"
              value={summary.operations_count || 0}
            />
          </Card>
        </Col>

        {(Number(summary.incoming_rates_missing_count || 0) > 0 ||
          Number(summary.outgoing_rates_missing_count || 0) > 0) && (
          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
            message="Долларовые итоги рассчитаны не по всем операциям"
            description={`Без курса прихода: ${
              summary.incoming_rates_missing_count || 0
            }, без курса получения: ${
              summary.outgoing_rates_missing_count || 0
            }`}
          />
        )}
      </Row>
    </Card>
  );
}
