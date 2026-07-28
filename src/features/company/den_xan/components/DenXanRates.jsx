import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { InputNumber, Typography } from "antd";

import {
  moneyFormatter,
  moneyParser,
} from "../utils/numberInput";

import styles from "./DenXanRates.module.css";

const { Text } = Typography;

export default function DenXanRates({
  rates,
  saving,
  saved,
  onChange,
}) {
  return (
    <div className={styles.rates}>
      <div className={styles.rateField}>
        <Text className={styles.label}>
          Курс DEN XAN
        </Text>

        <InputNumber
          min={0.01}
          precision={2}
          placeholder="12 050"
          value={rates.den_xan_rate}
          formatter={moneyFormatter}
          parser={moneyParser}
          onChange={(value) =>
            onChange("den_xan_rate", value)
          }
          className={styles.input}
        />
      </div>

      <div className={styles.rateField}>
        <Text className={styles.label}>
          Курс улицы
        </Text>

        <InputNumber
          min={0.01}
          precision={2}
          placeholder="12 100"
          value={rates.street_rate}
          formatter={moneyFormatter}
          parser={moneyParser}
          onChange={(value) =>
            onChange("street_rate", value)
          }
          className={styles.input}
        />
      </div>

      <div className={styles.status}>
        {saving && (
          <>
            <LoadingOutlined />
            <Text>Сохранение...</Text>
          </>
        )}

        {!saving && saved && (
          <>
            <CheckCircleOutlined />
            <Text>Сохранено</Text>
          </>
        )}
      </div>
    </div>
  );
}