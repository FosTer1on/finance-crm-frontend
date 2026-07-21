export const formatMoney = (value) => {
    const number = Number(value || 0);
  
    return `${new Intl.NumberFormat("ru-RU").format(number)} сум`;
  };