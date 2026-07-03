import { Card, Descriptions, Space, Tag, Typography } from "antd";
import { formatMoney } from "@utils/formatMoney";

const { Title, Text } = Typography;

export default function CompanyHeader({ company, totalBalance }) {
  if (!company) return null;

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
            {company.name}
          </Title>

          <Tag color={company.schema_type === "den_xan" ? "purple" : "blue"}>
            {company.schema_type}
          </Tag>
        </div>

        <Descriptions bordered column={3}>
          <Descriptions.Item label="ID">{company.id}</Descriptions.Item>
          <Descriptions.Item label="ИНН">{company.inn}</Descriptions.Item>
          <Descriptions.Item label="Активна">
            {company.is_active ? "Да" : "Нет"}
          </Descriptions.Item>

          <Descriptions.Item label="Общий баланс" span={3}>
            <Text strong>{formatMoney(totalBalance)}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}