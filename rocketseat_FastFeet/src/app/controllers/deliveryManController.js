import * as Yup from 'yup';

import DeliveryMan from '../models/deliveryMan';
import File from '../models/file';

class DeliveryController {
  async index(req, res) {
    const deliveries_man = await DeliveryMan.findAll({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliveries_man);
  }

  async get(req, res) {
    const { id } = req.params;
    const delivery_man = await DeliveryMan.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(delivery_man);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryManExists = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (deliveryManExists)
      return res.status(400).json({ error: 'User already exists.' });

    const { id, name, email } = await DeliveryMan.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const delivery_man = await DeliveryMan.findByPk(req.params.id);

    if (email && email !== delivery_man.email) {
      const deliveryManExists = await DeliveryMan.findOne({
        where: { email },
      });

      if (deliveryManExists) {
        return res
          .status(400)
          .json({ error: 'Email already used by another user' });
      }
    }

    const { id, name, avatar_id } = await delivery_man.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const delivery_man = await DeliveryMan.findByPk(req.params.id);

    if (!delivery_man) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery_man.destroy(delivery_man);

    return res.json(delivery_man);
  }
}

export default new DeliveryController();
