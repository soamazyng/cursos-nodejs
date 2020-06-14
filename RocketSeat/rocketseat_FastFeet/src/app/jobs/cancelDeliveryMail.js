import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';
import l from '../../config/logger';

class CancelDeliveryMail {
  // desta forma é como se eu tivesse determinando uma propriedade static
  // sendo assim pode ser chamada sem precisar chamar o método
  get key() {
    return 'CancelDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    l.info('executou a fila');
    l.info(delivery);

    await Mail.sendMail({
      to: `${delivery.delivery_man.name} <${delivery.delivery_man.email}>`,
      subject: 'Uma encomenda foi cancelada',
      template: 'cancelDelivery',
      context: {
        cliente: delivery.recipient.name,
        objeto: delivery.product,
        data_cancelamento: format(
          parseISO(delivery.canceled_at),
          "'dia' dd 'de' MMMM',' 'às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancelDeliveryMail();
