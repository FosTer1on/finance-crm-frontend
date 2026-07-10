import { Card, Col, Row, Statistic } from "antd";
import { formatMoney } from "@/utils/formatMoney";

const items = [
  {
    key: "incoming_total",
    title: "Общий приход",
  },
  {
    key: "profit_total",
    title: "Прибыль",
  },
  {
    key: "mtg_total",
    title: "MTG",
  },
  {
    key: "to_account_total",
    title: "Поступило на счёт",
  },
  {
    key: "given_total",
    title: "Отдали после вычета % и MTG",
  },
  {
    key: "outgoing_total",
    title: "Общая сумма исходов",
  },
  {
    key: "need_to_receive",
    title: "Нужно получить после вычета %",
  },
  {
    key: "expenses_total",
    title: "Прочие расходы",
  },
];

export default function ReportSummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={item.key}>
          <Card size="small">
            <Statistic
              title={item.title}
              value={summary[item.key] || 0}
              formatter={(value) => formatMoney(value)}
            />
          </Card>
        </Col>
      ))}

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Всего операций"
            value={summary.operations_count || 0}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Приходных операций"
            value={summary.incoming_operations_count || 0}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Исходящих операций"
            value={summary.outgoing_operations_count || 0}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Прочих расходов"
            value={summary.expenses_count || 0}
          />
        </Card>
      </Col>
    </Row>
  );
}