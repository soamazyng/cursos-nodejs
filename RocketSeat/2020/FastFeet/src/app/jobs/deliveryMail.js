import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';
import l from '../../config/logger';

class DeliveryMail {
  // desta forma é como se eu tivesse determinando uma propriedade static
  // sendo assim pode ser chamada sem precisar chamar o método
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    l.info('executou a fila');
    l.info(delivery);

    await Mail.sendMail({
      to: `${delivery.delivery_man.name} <${delivery.delivery_man.email}>`,
      subject: 'Uma nova encomenda foi cadastrada',
      template: 'delivery',
      context: {
        cliente: delivery.recipient.name,
        objeto: delivery.product,
        endereco: `${delivery.recipient.rua}, ${delivery.recipient.numero} - ${delivery.recipient.complemento} - ${delivery.recipient.cidade} - ${delivery.recipient.estado} CEP: ${delivery.recipient.cep}`,
      },
    });
  }
}

export default new DeliveryMail();
