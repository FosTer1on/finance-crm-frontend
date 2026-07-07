import { Input, Modal, Space, Typography } from "antd";

const { Text } = Typography;

export default function PartnerInfoModal({
  open,
  form,
  loading,
  onCancel,
  onChange,
  onSave,
}) {
  return (
    <Modal
      title="Фирма исхода"
      open={open}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={loading}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Text strong>Название фирмы</Text>
          <Input
            style={{ marginTop: 6 }}
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </div>

        <div>
          <Text strong>ИНН</Text>
          <Input
            style={{ marginTop: 6 }}
            placeholder="Необязательно"
            value={form.inn}
            onChange={(event) => onChange("inn", event.target.value)}
          />
        </div>

        {/* <div>
          <Text strong>Контакты</Text>
          <Input
            style={{ marginTop: 6 }}
            placeholder="Необязательно"
            value={form.contacts}
            onChange={(event) => onChange("contacts", event.target.value)}
          />
        </div> */}

        <div>
          <Text strong>Комментарий</Text>
          <Input.TextArea
            rows={4}
            style={{ marginTop: 6 }}
            placeholder="Необязательно"
            value={form.comment}
            onChange={(event) => onChange("comment", event.target.value)}
          />
        </div>
      </Space>
    </Modal>
  );
}