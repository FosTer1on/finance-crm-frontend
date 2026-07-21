import { Card, Col, Row, Statistic } from "antd";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUsd } from "../../utils/formatCurrency";

const moneyItems = [
  {
    key: "incoming_total",
    title: "Общий приход",
  },
  {
    key: "profit_total",
    title: "Комиссия 6%",
  },
  {
    key: "mtg_total",
    title: "MTG",
  },
  {
    key: "to_account_total",
    title: "Доступно на счету",
  },
  {
    key: "given_total",
    title: "Ответ кэша для DEN XAN",
  },
  {
    key: "outgoing_total",
    title: "Расходы на рекламу",
  },
  {
    key: "advertising_commission_total",
    title: "Комиссия рекламы",
  },
  {
    key: "need_to_receive",
    title: "Кэш от рекламы",
  },
  {
    key: "expenses_total",
    title: "Прочие расходы со счёта",
  },
];

const resultItems = [
  {
    key: "loss",
    title: "Обычный убыток",
  },
  {
    key: "exchange_loss",
    title: "Курсовой убыток",
  },
  {
    key: "total_loss",
    title: "Общий убыток",
  },
];

export default function ReportSummaryCards({
  summary,
}) {
  if (!summary) return null;

  return (
    <Row gutter={[16, 16]}>
      {moneyItems.map((item) => (
        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
          key={item.key}
        >
          <Card size="small">
            <Statistic
              title={item.title}
              value={summary[item.key] || 0}
              formatter={(value) =>
                formatMoney(value)
              }
            />
          </Card>
        </Col>
      ))}

      {resultItems.map((item) => {
        const uzs =
          summary[`${item.key}_uzs`];

        const usd =
          summary[`${item.key}_usd`];

        const isProfit = Number(uzs || 0) < 0;

        return (
          <Col
            xs={24}
            sm={12}
            lg={8}
            xl={6}
            key={item.key}
          >
            <Card size="small">
              <Statistic
                title={
                  isProfit
                    ? item.title.replace(
                        "убыток",
                        "прибыль"
                      )
                    : item.title
                }
                value={uzs || 0}
                formatter={(value) =>
                  formatMoney(value)
                }
              />

              <strong>{formatUsd(usd)}</strong>
            </Card>
          </Col>
        );
      })}

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Пришло кэша"
            value={summary.cash_in_total || 0}
            formatter={(value) =>
              formatUsd(value)
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Ушло кэша"
            value={summary.cash_out_total || 0}
            formatter={(value) =>
              formatUsd(value)
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Чистое движение кэша"
            value={summary.cash_net_total || 0}
            formatter={(value) =>
              formatUsd(value)
            }
          />
        </Card>
      </Col>

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
            value={
              summary.incoming_operations_count || 0
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Исходящих операций"
            value={
              summary.outgoing_operations_count || 0
            }
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

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Кэш-операций"
            value={
              summary.cash_operations_count || 0
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card size="small">
          <Statistic
            title="Дней без курсов"
            value={
              summary.days_without_rates || 0
            }
          />
        </Card>
      </Col>
    </Row>
  );
}