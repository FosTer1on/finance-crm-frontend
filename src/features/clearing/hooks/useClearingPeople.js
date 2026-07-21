import { useState } from "react";
import { message } from "antd";

const EMPTY_PERSON_FORM = {
  id: null,
  name: "",
  comment: "",
  is_active: true,
};

export const useClearingPeople = ({
  people,
  createPerson,
  updatePerson,
  updateDraft,
  updateRowDraft,
}) => {
  const [personModal, setPersonModal] = useState(null);

  const applyPersonToTarget = (target, personId) => {
    const field =
      target.side === "sender"
        ? "sender_person_id"
        : "receiver_person_id";

    if (target.row.isNew) {
      updateDraft(field, personId);
      return;
    }

    updateRowDraft(target.row.id, field, personId);
  };

  const openCreatePerson = ({ side, row }) => {
    setPersonModal({
      mode: "create",
      target: {
        side,
        row,
      },
      form: {
        ...EMPTY_PERSON_FORM,
      },
    });
  };

  const openEditPerson = ({ personId, side, row }) => {
    const person = people.find((item) => item.id === personId);

    if (!person) {
      message.error("Человек не найден");
      return;
    }

    setPersonModal({
      mode: "edit",
      target: {
        side,
        row,
      },
      form: {
        id: person.id,
        name: person.name || "",
        comment: person.comment || "",
        is_active: person.is_active ?? true,
      },
    });
  };

  const closePersonModal = () => {
    setPersonModal(null);
  };

  const changePersonForm = (field, value) => {
    setPersonModal((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        form: {
          ...prev.form,
          [field]: value,
        },
      };
    });
  };

  const handleSavePerson = async () => {
    if (!personModal) return;

    const name = personModal.form.name?.trim();

    if (!name) {
      message.error("Введите имя");
      return;
    }

    const payload = {
      name,
      comment: personModal.form.comment || "",
      is_active: personModal.form.is_active ?? true,
    };

    let savedPerson;

    if (personModal.mode === "edit") {
      savedPerson = await updatePerson(
        personModal.form.id,
        payload
      );

      message.success("Данные человека обновлены");
    } else {
      savedPerson = await createPerson(payload);

      message.success("Человек создан");
    }

    applyPersonToTarget(
      personModal.target,
      savedPerson.id
    );

    closePersonModal();
  };

  return {
    personModal,
    emptyPersonForm: EMPTY_PERSON_FORM,

    openCreatePerson,
    openEditPerson,
    closePersonModal,
    changePersonForm,
    handleSavePerson,
  };
};