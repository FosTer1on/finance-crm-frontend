import { useEffect, useMemo } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { formatMoney } from "@/shared/utils/formatMoney";
import { moneyFormatter, moneyParser } from "../../utils/numberInput";

import styles from "./OutgoingQuickPanel.module.css";

const { Text } = Typography;
const { TextArea } = Input;

export default function OutgoingQuickPanel({
  partners = [],
  accounts = [],
  vatDistributor = null,
  isPartnersLoading = false,
  isSubmitting = false,
  createdPartnerId = null,
  onCreatedPartnerApplied,
  onCreate,
  onAddPartner,
}) {
  const [form] = Form.useForm();

  const selectedPartnerId = Form.useWatch("partner_id", form);

  const amount = Form.useWatch("amount", form);
  const servicePercent = Form.useWatch("service_percent", form);

  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === selectedPartnerId),
    [partners, selectedPartnerId]
  );

  const defaultPartner = useMemo(
    () => partners.find((partner) => partner.is_active && partner.is_default),
    [partners]
  );

  useEffect(() => {
    if (!defaultPartner) return;

    const currentPartnerId = form.getFieldValue("partner_id");

    if (currentPartnerId) return;

    form.setFieldValue("partner_id", defaultPartner.id);
  }, [defaultPartner, form]);

  const targetCompanyId = selectedPartner?.to_company || null;

  const targetAccounts = useMemo(() => {
    if (!targetCompanyId) {
      return [];
    }

    return accounts.filter((account) => account.company === targetCompanyId);
  }, [accounts, targetCompanyId]);

  const amountAfterPercent = useMemo(() => {
    const numericAmount = Number(amount || 0);
    const numericPercent = Number(servicePercent || 0);

    return numericAmount - numericAmount * (numericPercent / 100);
  }, [amount, servicePercent]);

  useEffect(() => {
    form.setFieldValue("target_bank_account_id", null);
  }, [form, selectedPartnerId]);

  useEffect(() => {
    if (!createdPartnerId) return;

    form.setFieldValue("partner_id", createdPartnerId);

    onCreatedPartnerApplied?.();
  }, [createdPartnerId, form, onCreatedPartnerApplied]);

  useEffect(() => {
    if (!selectedPartner) return;

    const partnerPercent = Number(selectedPartner.service_percent);

    form.setFieldValue(
      "service_percent",
      partnerPercent > 0 ? selectedPartner.service_percent : "9.00"
    );
  }, [form, selectedPartner]);

  const handleFinish = async (values) => {
    await onCreate(values);

    form.resetFields(["target_bank_account_id", "amount", "comment"]);

    form.setFieldsValue({
      partner_id: defaultPartner?.id ?? null,
      service_percent: "9.00",
      is_vat: false,
    });

    form.setFieldValue("service_percent", "9.00");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        service_percent: "9.00",
        comment: "",
        is_vat: false,
      }}
      onFinish={handleFinish}
      requiredMark={false}
      className={styles.form}
    >
      <Form.Item label="Фирма" className={styles.partnerField} required>
        <div className={styles.partnerRow}>
          <Form.Item
            name="partner_id"
            noStyle
            rules={[
              {
                required: true,
                message: "Выберите фирму",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              loading={isPartnersLoading}
              placeholder="Выберите фирму"
              optionFilterProp="label"
              options={partners
                .filter((partner) => partner.is_active)
                .map((partner) => ({
                  value: partner.id,
                  label: partner.name,
                }))}
            />
          </Form.Item>

          <Button
            icon={<PlusOutlined />}
            onClick={onAddPartner}
            aria-label="Добавить фирму"
          />
        </div>
      </Form.Item>

      {targetCompanyId && (
        <Form.Item
          name="target_bank_account_id"
          label="Счёт получателя"
          rules={[
            {
              required: true,
              message: "Выберите счёт получателя",
            },
          ]}
        >
          <Select
            placeholder="Выберите счёт"
            options={targetAccounts.map((account) => ({
              value: account.id,
              label: `${account.bank_name} — ${account.account_name}`,
            }))}
          />
        </Form.Item>
      )}

      <Form.Item
        name="amount"
        label="Сумма"
        rules={[
          {
            required: true,
            message: "Введите сумму",
          },
        ]}
      >
        <InputNumber
          min={0.01}
          precision={2}
          controls={false}
          placeholder="0"
          formatter={moneyFormatter}
          parser={moneyParser}
          className={styles.fullWidth}
        />
      </Form.Item>

      <div className={styles.commissionRow}>
        <Form.Item
          name="service_percent"
          label="Комиссия"
          rules={[
            {
              required: true,
              message: "Введите комиссию",
            },
          ]}
          className={styles.commissionField}
        >
          <InputNumber
            max={100}
            precision={2}
            controls={false}
            addonAfter="%"
            className={styles.fullWidth}
          />
        </Form.Item>

        <Form.Item
          name="is_vat"
          valuePropName="checked"
          className={styles.vatField}
        >
          <Checkbox disabled={!vatDistributor}>НДС</Checkbox>
        </Form.Item>
      </div>

      <div className={styles.cashResult}>
        <Text className={styles.cashLabel}>Кэш после комиссии</Text>

        <Text strong className={styles.cashValue}>
          {formatMoney(amountAfterPercent)}
        </Text>
      </div>

      <Form.Item name="comment" label="Комментарий">
        <TextArea rows={3} maxLength={500} placeholder="Необязательно" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isSubmitting} block>
        Создать исход
      </Button>
    </Form>
  );
}
