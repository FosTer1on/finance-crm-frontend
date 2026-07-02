import { Link } from "react-router-dom";
import { Button, Card, Col, Row, Space, Typography, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const companies = [
  {
    id: 1,
    name: "ASIA CONSTRUCT BUILDING",
    inn: "000000000",
    schema: "standard",
    balance: 125000000,
  },
  {
    id: 2,
    name: "DEN XAN GROUP",
    inn: "111111111",
    schema: "den_xan",
    balance: 85000000,
  },
  {
    id: 3,
    name: "MMA GROUP",
    inn: "222222222",
    schema: "standard",
    balance: 42000000,
  },
];

const formatMoney = (value) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

export default function CompaniesPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Фирмы
          </Title>
          <Text type="secondary">Список компаний и их текущие балансы</Text>
        </Col>

        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить фирму
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {companies.map((company) => (
          <Col xs={24} sm={12} lg={8} key={company.id}>
            <Link to={`/companies/${company.id}`}>
              <Card hoverable>
                <Space direction="vertical" size={6}>
                  <Title level={4} style={{ margin: 0 }}>
                    {company.name}
                  </Title>

                  <Text type="secondary">ИНН: {company.inn}</Text>

                  <Tag color={company.schema === "den_xan" ? "purple" : "blue"}>
                    {company.schema}
                  </Tag>

                  <Text strong>{formatMoney(company.balance)}</Text>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Space>
  );
}