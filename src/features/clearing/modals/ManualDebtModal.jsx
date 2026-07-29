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
} from "antd";
import dayjs from "dayjs";

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

export default function ManualDebtModal({
  open,
  people = [],
  companies = [],
  loading = false,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  const currency = Form.useWatch("currency", form);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      person_id: null,
      company_id: null,
      direction: "OWES_US",
      currency: "UZS",
      debt_date: dayjs(),
      amount: null,
      usd_rate: null,
      due_date: null,
      comment: "",
    });
  }, [open, form]);

  useEffect(() => {
    if (currency === "USD") {
      form.setFieldValue("usd_rate", null);
    }
  }, [currency, form]);

  const handleFinish = async (values) => {
    await onSubmit({
      person_id: values.person_id,
      company_id: values.company_id || null,
      direction: values.direction,
      currency: values.currency,
      debt_date: values.debt_date.format("YYYY-MM-DD"),
      amount: values.amount,
      usd_rate: values.currency === "UZS" ? values.usd_rate : null,
      due_date: values.due_date ? values.due_date.format("YYYY-MM-DD") : null,
      comment: values.comment?.trim() || "",
    });

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Добавить ручной долг"
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={560}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="person_id"
          label="Ответственное лицо"
          rules={[
            {
              required: true,
              message: "Выберите человека",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Выберите человека"
            optionFilterProp="label"
            options={people.map((person) => ({
              value: person.id,
              label: person.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="company_id" label="Фирма">
          <Select
            allowClear
            showSearch
            placeholder="Без фирмы"
            optionFilterProp="label"
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="direction"
          label="Направление долга"
          rules={[
            {
              required: true,
              message: "Выберите направление",
            },
          ]}
        >
          <Select
            options={[
              {
                value: "OWES_US",
                label: "Нам должны",
              },
              {
                value: "WE_OWE",
                label: "Мы должны",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="currency"
          label="Валюта долга"
          rules={[
            {
              required: true,
              message: "Выберите валюту",
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

        <Space size={12} align="start" style={{ width: "100%" }}>
          <Form.Item
            name="debt_date"
            label="Дата долга"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Укажите дату",
              },
            ]}
          >
            <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="due_date" label="Срок возврата" style={{ flex: 1 }}>
            <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Space>

        <Form.Item
          name="amount"
          label={currency === "USD" ? "Сумма долга в USD" : "Сумма долга в UZS"}
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
            addonAfter={currency === "USD" ? "$" : "сум"}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {currency === "UZS" && (
          <Form.Item
            name="usd_rate"
            label="Курс USD при создании долга"
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
          <TextArea rows={3} placeholder="Причина или описание долга" />
        </Form.Item>

        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button disabled={loading} onClick={onCancel}>
            Отмена
          </Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            Добавить долг
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
