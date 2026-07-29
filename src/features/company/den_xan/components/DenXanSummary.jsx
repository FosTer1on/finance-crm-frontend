import { Card, Typography } from "antd";

import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUsd } from "../utils/formatCurrency";

import styles from "./DenXanSummary.module.css";

const { Text, Title } = Typography;

const MoneyValue = ({ uzs, usd, large = false }) => (
  <div className={styles.moneyValue}>
    <div className={`${styles.uzsValue} ${large ? styles.uzsValueLarge : ""}`}>
      {formatMoney(uzs ?? 0)}
    </div>

    {usd !== undefined && usd !== null && (
      <Text className={styles.usdValue}>{formatUsd(usd)}</Text>
    )}
  </div>
);

const DetailRow = ({ label, value, isUsd = false, strong = false }) => (
  <div className={styles.detailRow}>
    <Text className={styles.detailLabel}>{label}</Text>

    <Text
      className={`${styles.detailValue} ${
        strong ? styles.detailValueStrong : ""
      }`}
    >
      {isUsd ? formatUsd(value ?? 0) : formatMoney(value ?? 0)}
    </Text>
  </div>
);

const LossCard = ({ title, uzs, usd, main = false }) => {
  const isProfit = Number(uzs || 0) < 0;

  return (
    <Card
      className={`${styles.lossCard} ${main ? styles.totalLossCard : ""}`}
      styles={{
        body: {
          padding: 20,
          height: "100%",
        },
      }}
    >
      <Text className={styles.cardLabel}>{title}</Text>

      <div
        className={`${styles.lossValue} ${isProfit ? styles.profitValue : ""}`}
      >
        {formatMoney(uzs ?? 0)}
      </div>

      {usd !== undefined && usd !== null && (
        <Text
          className={`${styles.lossUsd} ${isProfit ? styles.profitValue : ""}`}
        >
          {formatUsd(usd)}
        </Text>
      )}
    </Card>
  );
};

export default function DenXanSummary({ summary }) {
  if (!summary) return null;

  const denXanCashUzs =
    summary.answer_den_xan_uzs ??
    summary.need_to_give ??
    summary.after_commission_total ??
    0;

  const denXanCashUsd = summary.answer_den_xan_usd;

  const advertisingCashUzs =
    summary.cash_from_ads_uzs ?? summary.need_to_receive ?? 0;

  const advertisingCashUsd = summary.cash_from_ads_usd;

  const vatCash =
    summary.cash_from_ads_vat_uzs ?? summary.advertising_vat_cash ?? 0;

  const cashWithoutVat =
    summary.cash_from_ads_without_vat_uzs ??
    summary.advertising_cash_without_vat ??
    Number(advertisingCashUzs || 0) - Number(vatCash || 0);

  return (
    <section className={styles.summary}>
      <div className={styles.header}>
        <div>
          <Title level={4} className={styles.title}>
            Итоги дня
          </Title>

          <Text className={styles.description}>
            Основные денежные показатели и результат рабочего дня
          </Text>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <Card
          className={styles.primaryCard}
          styles={{
            body: {
              padding: 22,
              height: "100%",
            },
          }}
        >
          <div className={styles.cardHeader}>
            <div>
              <Text className={styles.cardLabel}>Кэш DEN XAN</Text>

              <MoneyValue uzs={denXanCashUzs} usd={denXanCashUsd} large />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.details}>
            <DetailRow label="Поступления" value={summary.incoming_total} />

            <DetailRow
              label="После комиссии 6%"
              value={summary.after_commission_total}
            />

            <DetailRow label="Комиссия 6%" value={summary.profit} />

            <DetailRow label="MTG" value={summary.mtg} />
          </div>
        </Card>

        <Card
          className={styles.primaryCard}
          styles={{
            body: {
              padding: 22,
              height: "100%",
            },
          }}
        >
          <div className={styles.cardHeader}>
            <div>
              <Text className={styles.cardLabel}>Кэш от рекламы</Text>

              <MoneyValue
                uzs={advertisingCashUzs}
                usd={advertisingCashUsd}
                large
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.details}>
            <DetailRow label="Сумма вывода" value={summary.outgoing_total} />

            <DetailRow
              label="Комиссия рекламы"
              value={summary.advertising_commission}
            />

            <DetailRow label="Кэш НДС" value={vatCash} />

            <DetailRow label="Без НДС-операций" value={cashWithoutVat} strong />
          </div>
        </Card>

        <Card
          className={`${styles.primaryCard} ${styles.cashCard}`}
          styles={{
            body: {
              padding: 22,
              height: "100%",
            },
          }}
        >
          <Text className={styles.cardLabel}>КЭШ</Text>

          <div className={styles.cashValue}>
            {formatUsd(summary.cash_balance ?? 0)}
          </div>

          <Text className={styles.cashDescription}>
            Итоговый денежный остаток
          </Text>
        </Card>
      </div>

      <div className={styles.lossGrid}>
        <LossCard
          title="Обычный убыток"
          uzs={summary.loss_uzs}
          usd={summary.loss_usd}
        />

        <LossCard
          title="Курсовой убыток"
          uzs={summary.exchange_difference_uzs}
          usd={summary.exchange_difference_usd}
        />

        <LossCard
          title="Общий убыток"
          uzs={summary.total_loss_uzs}
          usd={summary.total_loss_usd}
          main
        />
      </div>
    </section>
  );
}
