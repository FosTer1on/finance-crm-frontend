import { Card, Col, Row, Statistic, Typography } from "antd";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../utils/formatCurrency";

const { Text } = Typography;

const getResultLabel = (value, lossLabel, profitLabel) => {
  const numericValue = Number(value || 0);

  return numericValue < 0 ? profitLabel : lossLabel;
};

export default function DenXanSummary({ summary }) {
  if (!summary) return null;

  const lossLabel = getResultLabel(
    summary.loss_uzs,
    "Обычный убыток",
    "Обычная прибыль"
  );

  const exchangeLabel = getResultLabel(
    summary.exchange_difference_uzs,
    "Курсовой убыток",
    "Курсовая прибыль"
  );

  const totalLossLabel = getResultLabel(
    summary.total_loss_uzs,
    "Общий убыток",
    "Общая прибыль"
  );

  const items = [
    {
      key: "commission",
      title: "Комиссия 6%",
      uzs: summary.profit,
    },
    {
      key: "mtg",
      title: "MTG",
      uzs: summary.mtg,
    },
    {
      key: "available",
      title: "Поступило на счет от дистрибьюторов",
      uzs: summary.to_den_xan_account,
    },
    {
      key: "answer",
      title: "Ответ DEN XAN",
      uzs: summary.answer_den_xan_uzs ?? summary.need_to_give,
      usd: summary.answer_den_xan_usd,
    },
    {
      key: "cash",
      title: "Кэш от рекламы",
      uzs: summary.cash_from_ads_uzs ?? summary.need_to_receive,
      usd: summary.cash_from_ads_usd,
    },
    {
      key: "outgoing_before_percent_total",
      title: "Общая сумма исходов",
    },
    {
      key: "loss",
      title: lossLabel,
      uzs: summary.loss_uzs,
      usd: summary.loss_usd,
      isResult: true,
    },
    {
      key: "exchange",
      title: exchangeLabel,
      uzs: summary.exchange_difference_uzs,
      usd: summary.exchange_difference_usd,
      isResult: true,
    },
    {
      key: "total",
      title: totalLossLabel,
      uzs: summary.total_loss_uzs,
      usd: summary.total_loss_usd,
      isResult: true,
    },
  ];

  return (
    <Card
      size="small"
      title="Итоги дня"
      style={{ marginTop: 16 }}
    >
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col
            key={item.key}
            xs={24}
            sm={12}
            lg={8}
            xl={6}
          >
            <Card
              size="small"
              style={{
                height: "100%",
                borderWidth: item.key === "total" ? 2 : 1,
              }}
            >
              <Statistic
                title={item.title}
                value={item.uzs ?? 0}
                formatter={(value) => formatMoney(value)}
              />

              {item.usd !== undefined && (
                <Text
                  type={
                    item.isResult &&
                    Number(item.usd || 0) < 0
                      ? "success"
                      : "secondary"
                  }
                  strong={item.key === "total"}
                >
                  {formatUsd(item.usd)}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}