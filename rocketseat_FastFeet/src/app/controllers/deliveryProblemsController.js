import * as Yup from 'yup';

import { Op } from 'sequelize';
import DeliveryProblems from '../models/deliveryProblems';
import Delivery from '../models/delivery';
import DeliveryMan from '../models/deliveryMan';
import Recipient from '../models/recipient';

import Queue from '../../lib/Queue';
import CancelDeliveryMail from '../jobs/cancelDeliveryMail';

class DeliveryProblemsController {
  /**
   * index
   * Lista todos os problemas de acordo com o delivery_id
   */
  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll({
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'canceled_at'],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  /**
   * get
   * Lista todos os problemas de acordo com o delivery_id
   */
  async get(req, res) {
    const delivery_id = req.params.id;
    const deliveryProblems = await DeliveryProblems.findAll({
      where: { delivery_id },
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'canceled_at'],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  /**
   * store
   * Disponível para o delivery_man salvar os problemas das estregas
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery_id = req.params.id;

    const { description } = req.body;

    // verifica se a entrega já foi retirada, pois se não foi, não tem por que ter problemas.
    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        start_date: {
          [Op.ne]: null,
        },
        end_date: null,
        canceled_at: null,
      },
    });

    if (delivery === null) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const { id } = await DeliveryProblems.create({ delivery_id, description });

    return res.json({
      id,
      delivery_id,
      description,
    });
  }

  /**
   * delete
   * Efetua o cancelamento de uma entrega
   */
  async cancelDelivery(req, res) {
    const deliveryProblems = await DeliveryProblems.findByPk(req.params.id);

    if (!deliveryProblems) {
      return res.status(404).json({ error: 'Delivery Problem not found' });
    }

    const { delivery_id } = deliveryProblems;

    // só podemos cancelar uma entrega que já saiu para ser entregue
    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        start_date: {
          [Op.ne]: null,
        },
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // cancelar o delivery
    await delivery.update({ canceled_at: new Date() });

    // disparar e-mail para delivery_man informando o cancelamento

    // agora vamos disparar um e-mail
    await Queue.add(CancelDeliveryMail.key, {
      delivery,
    });

    return res.json(delivery);
  }
}

export default new DeliveryProblemsController();
