import * as Yup from 'yup';
import User from '../models/user';

class UserController {
  async store(req, res) {
    // verifica se os campos obrigatórios estão sendo enviados e se estão no formato correto
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // verifica se o usuário já não existe no banco de dados
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists)
      return res.status(400).json({ error: 'User already exists.' });

    // save
    const { id, name, email } = await User.create(req.body);

    // return
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    // verifica se os campos obrigatórios estão sendo enviados e se estão no formato correto
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPasswod: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPasswod', (oldPasswod, field) =>
          oldPasswod ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // encontra o dado no banco
    // req.userId está sendo preenchido pelo middeware auth
    const user = await User.findByPk(req.userId);

    // desestruturação para validações
    const { email, oldPassword } = req.body;

    // verifica se o e-mail que está sendo alterado não já existe na base
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        return res.status(400).json({ error: 'User already exists.' });
    }

    // verifica se a senha antiga é igual
    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(404).json({ error: 'Password does not match.' });

    const { id, name } = await user.update(req.body);

    // return
    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
