import { Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function TransactionCard({
  title,
  buttonText,
  onCreate,
  children,
}) {
  return (
    <Card
      title={title}
      extra={
        buttonText ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            {buttonText}
          </Button>
        ) : null
      }
    >
      {children}
    </Card>
  );
}