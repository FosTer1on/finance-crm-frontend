import { Input, Modal, Space } from "antd";

const { TextArea } = Input;

export default function ClearingCompanyModal({
  open,
  form,
  loading,
  title = "Фирма",
  onChange,
  onCancel,
  onSave,
}) {
  return (
    <Modal
      open={open}
      title={title}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={onSave}
      destroyOnHidden
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          value={form.name}
          placeholder="Название фирмы"
          onChange={(event) => onChange("name", event.target.value)}
        />

        <Input
          value={form.inn}
          placeholder="ИНН"
          onChange={(event) => onChange("inn", event.target.value)}
        />

        <TextArea
          value={form.comment}
          placeholder="Комментарий"
          rows={4}
          onChange={(event) => onChange("comment", event.target.value)}
        />
      </Space>
    </Modal>
  );
}
