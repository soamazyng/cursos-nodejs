import * as Yup from 'yup';

import { isBefore, isAfter, setSeconds, setMinutes, setHours } from 'date-fns';

import { Op } from 'sequelize';

import Config from '../models/config';
import Delivery from '../models/delivery';
import DeliveryMan from '../models/deliveryMan';
import File from '../models/file';
import Recipient from '../models/recipient';

import Queue from '../../lib/Queue';
import DeliveryMail from '../jobs/deliveryMail';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async get(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(delivery);
  }

  async getDeliveriesByDeliveryMan(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findAll({
      where: { deliveryman_id: id, end_date: null, canceled_at: null },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(delivery);
  }

  async getDeliveryByDeliveryMan(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.ne]: null },
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(delivery);
  }

  /**
   * store
   * Cadastra uma nova encomenda e envia um e-mail para o entregador
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = await Delivery.create(req.body);

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    // agora vamos disparar um e-mail
    await Queue.add(DeliveryMail.key, {
      delivery,
    });

    return res.json(delivery);
  }

  /**
   * startDeliveryStore
   * Define uma data de início de entrega para um delivery-man
   */
  async startDeliveryStore(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id } = req.body;
    const deliveryman_id = req.params.id;

    const { key } = await Config.findOne({
      where: {
        name: 'config_start_hour',
      },
    });

    let { start_hour, end_hour } = key;

    let [hour, minute] = start_hour.split(':');
    start_hour = setSeconds(setMinutes(setHours(new Date(), hour), minute), 0);

    [hour, minute] = end_hour.split(':');
    end_hour = setSeconds(setMinutes(setHours(new Date(), hour), minute), 0);

    // vamos validar quantas retiradas o entregador já fez hoje
    const totalDeliveryToday = await Delivery.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [start_hour, end_hour],
        },
        canceled_at: null,
      },
    });

    if (totalDeliveryToday > 5) {
      return res
        .status(400)
        .json({ error: 'Total delivery limit exceeded for today!' });
    }

    // vamos verificar se este delivery-man pode pegar esta encomenda
    const delivery = await Delivery.findOne({
      where: {
        id: recipient_id,
        deliveryman_id,
        start_date: null,
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (delivery === null) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // verifica se ele pode fazer a retirada hoje
    const is_avalible =
      isAfter(new Date(), start_hour) && isBefore(new Date(), end_hour);

    if (!is_avalible) {
      return res.status(400).json({ error: 'Delivery time exceeded' });
    }

    const result = await delivery.update({ start_date: new Date() });

    return res.json({
      result,
    });
  }

  /**
   * endDeliveryStore
   * Define uma data de início de entrega para um delivery-man
   */
  async endDeliveryStore(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, signature_id } = req.body;
    const deliveryman_id = req.params.id;

    // vamos verificar se este delivery-man pode pegar esta encomenda
    const delivery = await Delivery.findOne({
      where: {
        id: recipient_id,
        deliveryman_id,
        start_date: {
          [Op.ne]: null,
        },
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'delivery_man',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (delivery === null) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const file = await Config.findByPk(signature_id);

    if (file === null) {
      return res.status(404).json({ error: 'Signature file not found' });
    }

    const result = await delivery.update({
      end_date: new Date(),
      signature_id,
    });

    return res.json({
      result,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    const { id, recipient_id, deliveryman_id, product } = await delivery.update(
      req.body
    );

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.destroy(delivery);

    return res.json(delivery);
  }
}

export default new DeliveryController();
