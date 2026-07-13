import { Select } from "antd";

import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";

export default function ClearingPersonSelect({
  value,
  onChange,
  placeholder = "Выберите человека",
  style,
}) {
  const {
    people,
    isLoadingPeople,
  } = useClearingDirectoryStore();

  return (
    <Select
      showSearch
      allowClear
      value={value || undefined}
      placeholder={placeholder}
      style={style}
      loading={isLoadingPeople}
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label || "")
          .toLocaleLowerCase("ru-RU")
          .includes(
            input
              .trim()
              .toLocaleLowerCase("ru-RU")
          )
      }
      onChange={onChange}
      options={people.map((person) => ({
        value: person.id,
        label: person.name,
      }))}
      notFoundContent="Человек не найден"
    />
  );
}