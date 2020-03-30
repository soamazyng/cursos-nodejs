import * as Yup from 'yup';
import Recipient from '../models/recipient';

class RecipientController {
  async index(req, res) {
    const recipient = await Recipient.findAll({ order: [['name', 'ASC']] });

    return res.json(recipient);
  }

  async get(req, res) {
    // validação do schema
    const schemaParams = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // encontra o dado no banco
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    return res.json(recipient);
  }

  async store(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string()
        .required()
        .max(2),
      cidade: Yup.string().required(),
      cep: Yup.string()
        .required()
        .max(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // save
    const { id, name } = await Recipient.create(req.body);

    // return
    return res.json({
      id,
      name,
    });
  }

  async update(req, res) {
    // verifica se os campos obrigatórios estão sendo enviados e se estão no formato correto
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string()
        .required()
        .max(2),
      cidade: Yup.string().required(),
      cep: Yup.string()
        .required()
        .max(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // encontra o dado no banco
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    const { name } = await recipient.update(req.body);

    // return
    return res.json({
      id,
      name,
    });
  }
}

export default new RecipientController();
