import { Card, Col, Row, Statistic, Typography } from "antd";

import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUsd } from "../utils/formatCurrency";

const { Text } = Typography;

export default function DenXanSummary({ summary }) {
  if (!summary) return null;

  const items = [
    {
      key: "incoming",
      title: "Поступления от дистрибьюторов",
      uzs: summary.incoming_total,
    },
    {
      key: "after_commission",
      title: "Сумма после вычета комиссии 6%",
      uzs: summary.after_commission_total,
    },
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
      key: "answer",
      title: "Ответ DEN XAN",
      uzs: summary.answer_den_xan_uzs ?? summary.need_to_give,
      usd: summary.answer_den_xan_usd,
    },
    {
      key: "outgoing",
      title: "Сумма вывода на рекламу",
      uzs: summary.outgoing_total,
    },
    {
      key: "advertising_commission",
      title: "Комиссия рекламы",
      uzs: summary.advertising_commission,
    },
    {
      key: "cash_from_ads",
      title: "Кэш от рекламы",
      uzs: summary.cash_from_ads_uzs ?? summary.need_to_receive,
      usd: summary.cash_from_ads_usd,
    },
    {
      key: "loss",
      title: "Обычный убыток",
      uzs: summary.loss_uzs,
      usd: summary.loss_usd,
      isResult: true,
    },
    {
      key: "exchange",
      title: "Курсовой убыток",
      uzs: summary.exchange_difference_uzs,
      usd: summary.exchange_difference_usd,
      isResult: true,
    },
    {
      key: "total",
      title: "Общий убыток",
      uzs: summary.total_loss_uzs,
      usd: summary.total_loss_usd,
      isResult: true,
    },
    {
      key: "cash_balance",
      title: "Кэш",
      usdOnly: summary.cash_balance,
    },
  ];

  return (
    <Card size="small" title="Итоги дня" style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        {items.map((item) => {
          const resultIsProfit = item.isResult && Number(item.uzs || 0) < 0;

          return (
            <Col key={item.key} xs={24} sm={12} lg={8} xl={6}>
              <Card
                size="small"
                style={{
                  height: "100%",
                  borderWidth: item.key === "total" ? 2 : 1,
                }}
              >
                {item.usdOnly !== undefined ? (
                  <>
                    <Text type="secondary">{item.title}</Text>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 24,
                        fontWeight: 600,
                      }}
                    >
                      {formatUsd(item.usdOnly)}
                    </div>
                  </>
                ) : (
                  <>
                    <Statistic
                      title={item.title}
                      value={item.uzs ?? 0}
                      formatter={(value) => formatMoney(value)}
                    />

                    {item.usd !== undefined && item.usd !== null && (
                      <Text
                        type={resultIsProfit ? "success" : "secondary"}
                        strong={item.key === "total"}
                      >
                        {formatUsd(item.usd)}
                      </Text>
                    )}
                  </>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
