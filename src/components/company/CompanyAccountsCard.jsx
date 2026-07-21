import { Card, Col, Empty, Row, Space, Spin, Typography } from "antd";
import { formatMoney } from "@/shared/utils/formatMoney";

const { Text } = Typography;

export default function CompanyAccountsCard({
  accounts = [],
  totalBalance = 0,
  isLoading = false,
}) {
  return (
    <Card title="Банковские счета">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Text strong>Общий баланс: {formatMoney(totalBalance)}</Text>

        {isLoading ? (
          <Spin />
        ) : accounts.length === 0 ? (
          <Empty description="Счета не найдены" />
        ) : (
          <Row gutter={[16, 16]}>
            {accounts.map((account) => (
              <Col xs={24} md={12} lg={8} key={account.id}>
                <Card size="small">
                  <Space direction="vertical" size={4}>
                    <Text strong>{account.bank_name}</Text>
                    <Text>Название счёта: {account.account_name}</Text>
                    <Text type="secondary">
                      Номер счёта: {account.account_number || "Не указан"}
                    </Text>
                    <Text strong>Баланс: {formatMoney(account.balance)}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </Card>
  );
}