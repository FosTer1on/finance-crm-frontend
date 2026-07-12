import { Button, Card, InputNumber, Space, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import {
  moneyFormatter,
  moneyParser,
} from "../utils/numberInput";

const { Text } = Typography;

export default function DenXanRates({
  rates,
  loading,
  onChange,
  onSave,
}) {
  return (
    <Card size="small">
      <Space wrap size="large">
        <Space direction="vertical" size={4}>
          <Text strong>Курс DEN XAN</Text>

          <InputNumber
            min={0.01}
            precision={2}
            placeholder="Например: 12 050"
            style={{ width: 190 }}
            value={rates.den_xan_rate}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) =>
              onChange("den_xan_rate", value)
            }
          />
        </Space>

        <Space direction="vertical" size={4}>
          <Text strong>Курс улицы</Text>

          <InputNumber
            min={0.01}
            precision={2}
            placeholder="Например: 12 100"
            style={{ width: 190 }}
            value={rates.street_rate}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) =>
              onChange("street_rate", value)
            }
          />
        </Space>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={onSave}
          style={{ marginTop: 22 }}
        >
          Сохранить курсы
        </Button>
      </Space>
    </Card>
  );
}