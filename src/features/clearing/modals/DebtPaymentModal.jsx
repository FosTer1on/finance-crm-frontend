import { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
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

const getDebtCurrency = (debt) => debt?.currency || "UZS";

const getDebtAmount = (debt) => Number(debt?.remaining_amount || 0);

export default function DebtPaymentModal({
  open,
  debt,
  loading = false,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  const paymentCurrency = Form.useWatch("payment_currency", form);

  const debtCurrency = getDebtCurrency(debt);

  const requiresRate =
    paymentCurrency && debtCurrency && paymentCurrency !== debtCurrency;

  useEffect(() => {
    if (!open || !debt) {
      return;
    }

    form.setFieldsValue({
      payment_date: dayjs(),
      payment_currency: debtCurrency,
      payment_amount: getDebtAmount(debt),
      usd_rate: null,
      comment: "",
    });
  }, [open, debt, debtCurrency, form]);

  useEffect(() => {
    if (!requiresRate) {
      form.setFieldValue("usd_rate", null);
    }
  }, [requiresRate, form]);

  const handleFinish = async (values) => {
    await onSubmit({
      payment_date: values.payment_date.format("YYYY-MM-DD"),
      payment_currency: values.payment_currency,
      payment_amount: values.payment_amount,
      usd_rate: requiresRate ? values.usd_rate : null,
      comment: values.comment?.trim() || "",
    });

    form.resetFields();
  };

  const formattedRemaining =
    debtCurrency === "USD"
      ? `$${formatMoney(debt?.remaining_amount)}`
      : `${formatMoney(debt?.remaining_amount)} сум`;

  return (
    <Modal
      open={open}
      title={debt?.group_key ? "Погашение долга за день" : "Погашение долга"}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={520}
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
          <Text strong>{debt.person_name || "Дневной итог"}</Text>

          <Text type="secondary">Остаток: {formattedRemaining}</Text>

          {debt.debt_date && (
            <Text type="secondary">
              Дата долга: {dayjs(debt.debt_date).format("DD.MM.YYYY")}
            </Text>
          )}

          {!debt.group_key && (
            <Text type="secondary">{debt.company_name || "Без фирмы"}</Text>
          )}

          {debt.debts_count > 1 && (
            <Text type="secondary">Операций в группе: {debt.debts_count}</Text>
          )}
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
          name="payment_currency"
          label="Валюта платежа"
          rules={[
            {
              required: true,
              message: "Выберите валюту платежа",
            },
          ]}
        >
          <Select
            options={[
              {
                value: "UZS",
                label: "UZS — сум",
              },
              {
                value: "USD",
                label: "USD — доллар",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="payment_amount"
          label={
            paymentCurrency === "USD"
              ? "Сумма платежа в USD"
              : "Сумма платежа в UZS"
          }
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
            addonAfter={paymentCurrency === "USD" ? "$" : "сум"}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {requiresRate && (
          <Form.Item
            name="usd_rate"
            label="Курс USD для погашения"
            rules={[
              {
                required: true,
                message: "Укажите курс USD",
              },
              {
                validator: (_, value) => {
                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error("Курс должен быть больше нуля")
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
        )}

        <Form.Item name="comment" label="Комментарий">
          <TextArea rows={3} placeholder="Комментарий к погашению" />
        </Form.Item>

        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button disabled={loading} onClick={onCancel}>
            Отмена
          </Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            Погасить
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
