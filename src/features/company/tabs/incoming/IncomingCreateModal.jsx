import { Form, Input, InputNumber, Select } from "antd";
import BaseTransactionModal from "@components/modals/BaseTransactionModal";

export default function IncomingCreateModal({
  open,
  onCancel,
  onSubmit,
  company,
  accounts = [],
  distributors = [],
  loading = false,
}) {
  const [form] = Form.useForm();

  const isDenXan = company?.schema_type === "den_xan";

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
      title="Добавить приход"
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

        {isDenXan ? (
          <>
            <Form.Item
              label="Дистрибьютор"
              name="distributor_id"
              rules={[{ required: true, message: "Выберите дистрибьютора" }]}
            >
              <Select
                placeholder="Выберите дистрибьютора"
                options={distributors.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </Form.Item>

            <Form.Item label="MTG" name="mtg_amount" initialValue={0}>
              <InputNumber style={{ width: "100%" }} min={0} precision={2} />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label="Фирма прихода" name="counterparty_name">
              <Input />
            </Form.Item>

            <Form.Item label="ИНН фирмы прихода" name="counterparty_inn">
              <Input />
            </Form.Item>

            <Form.Item label="Контакты" name="counterparty_contacts">
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