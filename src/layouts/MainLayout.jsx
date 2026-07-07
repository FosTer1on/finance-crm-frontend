import { Outlet } from "react-router-dom";
import { Layout, Typography } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Title level={4} style={{ margin: 0, lineHeight: "64px" }}>
          CRM транзакций
        </Title>
      </Header>

      <Content style={{ padding: 24, paddingBottom: 72 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}