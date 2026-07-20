import { Flex, Spin } from "antd";

export default function PageLoader() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: "50vh",
      }}
    >
      <Spin size="large" />
    </Flex>
  );
}