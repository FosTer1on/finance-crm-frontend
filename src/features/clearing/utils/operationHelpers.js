import { message } from "antd";

export const validateOperation = (form) => {
  if (!form.sender_person_id) {
    message.error("Выберите имя отправителя");
    return false;
  }

  if (
    form.incoming_amount === null ||
    form.incoming_amount === undefined ||
    Number(form.incoming_amount) <= 0
  ) {
    message.error("Введите сумму прихода");
    return false;
  }

  if (form.incoming_percent === null || form.incoming_percent === undefined) {
    message.error("Введите комиссию прихода");
    return false;
  }

  if (!form.receiver_person_id) {
    message.error("Выберите получателя");
    return false;
  }

  if (form.outgoing_percent === null || form.outgoing_percent === undefined) {
    message.error("Введите комиссию получения");
    return false;
  }

  return true;
};

export const normalizeOptionalRate = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) <= 0
  ) {
    return null;
  }

  return value;
};

export const buildOperationPayload = (form, operationDate) => ({
  operation_date: operationDate,

  sender_person_id: form.sender_person_id,
  sender_company_id: null,

  incoming_amount: form.incoming_amount,
  incoming_percent: form.incoming_percent,
  incoming_usd_rate: normalizeOptionalRate(form.incoming_usd_rate),

  receiver_person_id: form.receiver_person_id,
  receiver_company_id: null,

  outgoing_percent: form.outgoing_percent,
  outgoing_usd_rate: normalizeOptionalRate(form.outgoing_usd_rate),

  comment: form.comment || "",
});
