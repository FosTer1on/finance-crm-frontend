const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calculateOperationPreview = (draft = {}) => {
  const incomingAmount = toNumber(draft.incoming_amount);
  const incomingPercent = toNumber(draft.incoming_percent);
  const incomingRate = toNumber(draft.incoming_usd_rate);

  const outgoingPercent = toNumber(draft.outgoing_percent);
  const outgoingRate = toNumber(draft.outgoing_usd_rate);

  const incomingCommission = (incomingAmount * incomingPercent) / 100;

  const amountToGiveUzs = incomingAmount - incomingCommission;

  const outgoingCommission = (incomingAmount * outgoingPercent) / 100;

  // Вариант A:
  // вторая комиссия считается от исходной суммы прихода.
  const amountToReceiveUzs = incomingAmount - outgoingCommission;

  return {
    incoming_commission: roundMoney(incomingCommission),

    amount_to_give_uzs: roundMoney(amountToGiveUzs),
    amount_to_give_usd:
      incomingRate > 0 ? roundMoney(amountToGiveUzs / incomingRate) : null,

    outgoing_commission: roundMoney(outgoingCommission),

    amount_to_receive_uzs: roundMoney(amountToReceiveUzs),
    amount_to_receive_usd:
      outgoingRate > 0 ? roundMoney(amountToReceiveUzs / outgoingRate) : null,
  };
};
