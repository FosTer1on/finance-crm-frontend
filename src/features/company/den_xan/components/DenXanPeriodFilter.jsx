import { Button, DatePicker, Space, Typography } from "antd";

import { getPeriodRange } from "../utils/periodPresets";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PRESETS = [
  {
    key: "today",
    label: "Сегодня",
  },
  {
    key: "yesterday",
    label: "Вчера",
  },
  {
    key: "week",
    label: "Неделя",
  },
  {
    key: "month",
    label: "Месяц",
  },
];

export default function DenXanPeriodFilter({
  value,
  activePreset,
  onChange,
}) {
  const selectPreset = (preset) => {
    onChange({
      range: getPeriodRange(preset),
      preset,
    });
  };

  return (
    <Space wrap size="small">
      {PRESETS.map((preset) => (
        <Button
          key={preset.key}
          type={
            activePreset === preset.key
              ? "primary"
              : "default"
          }
          onClick={() => selectPreset(preset.key)}
        >
          {preset.label}
        </Button>
      ))}

      <RangePicker
        value={value}
        format="DD.MM.YYYY"
        allowClear={false}
        onChange={(range) => {
          if (!range?.[0] || !range?.[1]) return;

          onChange({
            range,
            preset: "custom",
          });
        }}
      />

      {value?.[0] && value?.[1] && (
        <Text type="secondary">
          Период: {value[0].format("DD.MM.YYYY")} —{" "}
          {value[1].format("DD.MM.YYYY")}
        </Text>
      )}
    </Space>
  );
}