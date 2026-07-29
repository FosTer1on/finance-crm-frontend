import { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { formatMoney } from "@/shared/utils/formatMoney";

const { Text } = Typography;
const { TextArea } = Input;

const moneyFormatter = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return new Intl.NumberFormat("ru-RU").format(
    String(value).replace(/\s/g, "")
  );
};

const moneyParser = (value) =>
  String(value || "")
    .replace(/\s/g, "")
    .replace(",", ".");

export default function DebtPaymentModal({
  open,
  debt,
  loading,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !debt) {
      return;
    }

    form.setFieldsValue({
      payment_date: dayjs(),
      amount: Number(debt.remaining_amount || 0),
      usd_rate: debt.usd_rate ? Number(debt.usd_rate) : null,
      comment: "",
    });
  }, [open, debt, form]);

  const handleFinish = async (values) => {
    await onSubmit({
      payment_date: values.payment_date.format("YYYY-MM-DD"),
      amount: values.amount,
      usd_rate: values.usd_rate || null,
      comment: values.comment?.trim() || "",
    });

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Погашение долга"
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      {debt && (
        <Space
          direction="vertical"
          size={4}
          style={{
            width: "100%",
            marginBottom: 18,
          }}
        >
          <Text strong>{debt.person_name}</Text>

          <Text type="secondary">
            Остаток: {formatMoney(debt.remaining_amount)}
          </Text>

          <Text type="secondary">{debt.company_name || "Без фирмы"}</Text>
        </Space>
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="payment_date"
          label="Дата погашения"
          rules={[
            {
              required: true,
              message: "Укажите дату",
            },
          ]}
        >
          <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Сумма погашения"
          rules={[
            {
              required: true,
              message: "Укажите сумму",
            },
            {
              validator: (_, value) => {
                if (Number(value) <= 0) {
                  return Promise.reject(
                    new Error("Сумма должна быть больше нуля")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0.01}
            precision={2}
            formatter={moneyFormatter}
            parser={moneyParser}
            addonAfter="сум"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="usd_rate" label="Курс USD">
          <InputNumber
            min={0}
            precision={2}
            formatter={moneyFormatter}
            parser={moneyParser}
            addonAfter="сум"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <TextArea rows={3} placeholder="Комментарий к погашению" />
        </Form.Item>

        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onCancel}>Отмена</Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            Погасить
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
