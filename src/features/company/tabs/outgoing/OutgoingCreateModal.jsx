import { Form, Input, InputNumber, Select } from "antd";
import BaseTransactionModal from "@components/modals/BaseTransactionModal";

export default function OutgoingCreateModal({
  open,
  onCancel,
  onSubmit,
  company,
  accounts = [],
  partners = [],
  loading = false,
}) {
  const [form] = Form.useForm();

  const selectedPartnerId = Form.useWatch("partner_id", form);
  const hasPartner = Boolean(selectedPartnerId);

  const handleOk = async () => {
    const values = await form.validateFields();

    await onSubmit({
      ...values,
      company_id: company.id,
      status: "completed",
    });

    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <BaseTransactionModal
      title="Добавить исходящий"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Банковский счёт"
          name="bank_account_id"
          rules={[{ required: true, message: "Выберите счёт" }]}
        >
          <Select
            placeholder="Выберите счёт"
            options={accounts.map((account) => ({
              value: account.id,
              label: `${account.bank_name} — ${account.account_name}`,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Дата"
          name="transaction_date"
          rules={[{ required: true, message: "Выберите дату" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Сумма"
          name="amount"
          rules={[{ required: true, message: "Введите сумму" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            placeholder="10000000"
          />
        </Form.Item>

        <Form.Item
          label="Процент услуги"
          name="service_percent"
          initialValue={6}
        >
          <InputNumber style={{ width: "100%" }} min={0} precision={2} />
        </Form.Item>

        <Form.Item label="Партнёр" name="partner_id">
          <Select
            allowClear
            placeholder="Выберите партнёра или заполните вручную"
            options={partners.map((partner) => ({
              value: partner.id,
              label: partner.name,
            }))}
          />
        </Form.Item>

        {!hasPartner && (
          <>
            <Form.Item label="Фирма получателя" name="receiver_company_name">
              <Input />
            </Form.Item>

            <Form.Item label="ИНН получателя" name="receiver_inn">
              <Input />
            </Form.Item>

            <Form.Item label="Контакты получателя" name="receiver_contacts">
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Имя человека" name="person_name">
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item label="Комментарий" name="comment">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </BaseTransactionModal>
  );
}