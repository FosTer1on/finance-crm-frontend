import { Select } from "antd";

import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";

export default function ClearingCompanySelect({
  value,
  onChange,
  placeholder = "Выберите фирму",
  style,
}) {
  const { companies, isLoadingCompanies } = useClearingDirectoryStore();

  return (
    <Select
      showSearch
      allowClear
      value={value || undefined}
      placeholder={placeholder}
      style={style}
      loading={isLoadingCompanies}
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label || "")
          .toLocaleLowerCase("ru-RU")
          .includes(input.trim().toLocaleLowerCase("ru-RU"))
      }
      onChange={onChange}
      options={companies.map((company) => ({
        value: company.id,
        label: company.name,
      }))}
      notFoundContent="Фирма не найдена"
    />
  );
}
