import { Button, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import ClearingPersonSelect from "./ClearingPersonSelect";

export default function ClearingPersonField({
  value,
  onChange,
  onCreate,
  onEdit,
}) {
  return (
    <Space.Compact style={{ width: "100%" }}>
      <ClearingPersonSelect
        value={value}
        onChange={onChange}
        style={{ width: "100%" }}
      />

      <Button
        icon={<EditOutlined />}
        disabled={!value}
        onClick={() => onEdit(value)}
      />

      <Button icon={<PlusOutlined />} onClick={onCreate} />
    </Space.Compact>
  );
}
