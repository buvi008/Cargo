import moment from 'moment';
import 'moment/locale/ru'
moment.locale('ru')

const formatDate = (data) => {
  return moment(data).calendar();
}

const formatStatus = (data, title) => {
  switch (+data) {
    case 0:
      return 'Новый заказ'
    case 1:
      return 'На складе в Турции'
    case 2:
      return 'На складе в МСК'
    case 3:
      return `Готов к выдаче (${title})`
    case 4:
      return 'Выдан'
    default:
      return data
  }
}

window.formatDate = formatDate;
window.formatStatus = formatStatus;

