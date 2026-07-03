import { Select } from "antd";

const statusOptions = [
  { value: "completed", label: "Выполнено" },
  { value: "cancelled", label: "Отменено" },
];

export default function StatusSelect({ value, loading = false, onChange }) {
  return (
    <Select
      size="small"
      value={value}
      options={statusOptions}
      style={{ width: 130 }}
      loading={loading}
      onChange={onChange}
    />
  );
}