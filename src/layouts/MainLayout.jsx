import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  BankOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240}>
        <div style={{ padding: 20 }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Finance CRM
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: <Link to="/">Фирмы</Link>,
            },
            {
              key: "/accounts",
              icon: <BankOutlined />,
              label: "Счета",
              disabled: true,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <Title level={4} style={{ margin: 0, lineHeight: "64px" }}>
            CRM транзакций
          </Title>
        </Header>

        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}