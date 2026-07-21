export const createEmptyDraft = () => ({
  sender_person_id: null,

  incoming_amount: null,
  incoming_percent: null,
  incoming_usd_rate: null,

  receiver_person_id: null,

  outgoing_percent: null,
  outgoing_usd_rate: null,

  comment: "",
});

export const operationToDraft = (operation) => ({
  sender_person_id: operation.sender_person,

  incoming_amount: operation.incoming_amount,
  incoming_percent: operation.incoming_percent,
  incoming_usd_rate: operation.incoming_usd_rate,

  receiver_person_id: operation.receiver_person,

  outgoing_percent: operation.outgoing_percent,
  outgoing_usd_rate: operation.outgoing_usd_rate,

  comment: operation.comment || "",
});
