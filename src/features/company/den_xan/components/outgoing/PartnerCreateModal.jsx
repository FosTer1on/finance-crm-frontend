import { Form, Input, InputNumber, Modal } from "antd";

const { TextArea } = Input;

export default function PartnerCreateModal({
  open,
  companyId,
  isSubmitting,
  onCancel,
  onCreate,
}) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values) => {
    await onCreate({
      from_company: companyId,
      name: values.name.trim(),
      inn: values.inn?.trim() || "",
      contacts: values.contacts?.trim() || "",
      service_percent: values.service_percent ?? "0.00",
      comment: values.comment?.trim() || "",
      is_active: true,
    });

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Новая фирма исхода"
      okText="Добавить"
      cancelText="Отмена"
      confirmLoading={isSubmitting}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          service_percent: "0.00",
          comment: "",
        }}
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Введите название фирмы",
            },
          ]}
        >
          <Input autoFocus maxLength={255} placeholder="Например, MMA GROUP" />
        </Form.Item>

        <Form.Item name="inn" label="ИНН">
          <Input maxLength={30} placeholder="Необязательно" />
        </Form.Item>

        <Form.Item name="contacts" label="Контакты">
          <Input maxLength={255} placeholder="Телефон или контактное лицо" />
        </Form.Item>

        <Form.Item name="service_percent" label="Комиссия по умолчанию">
          <InputNumber
            min={0}
            max={100}
            precision={2}
            controls={false}
            addonAfter="%"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <TextArea rows={3} maxLength={500} placeholder="Необязательно" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
