import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Empty, Row, Space, Spin, Typography, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCompanyStore } from "@store/company/companyStore";

const { Title, Text } = Typography;

export default function CompaniesPage() {
  const { companies, isLoading, error, loadCompanies } = useCompanyStore();

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Фирмы
          </Title>
          <Text type="secondary">Список компаний</Text>
        </Col>

        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить фирму
          </Button>
        </Col>
      </Row>

      {error && <Alert type="error" message="Ошибка" description={String(error)} showIcon />}

      {isLoading ? (
        <Spin />
      ) : companies.length === 0 ? (
        <Empty description="Фирмы не найдены" />
      ) : (
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

                    <Tag color={company.schema_type === "den_xan" ? "purple" : "blue"}>
                      {company.schema_type}
                    </Tag>
                  </Space>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}