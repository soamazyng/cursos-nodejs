import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/user';

import authConfig from '../../config/auth';

class AuthController {
  async signin(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (!(await user.checkPassword(password)))
      return res.status(404).json({ error: 'Password does not match.' });

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn, // 7 dias
      }),
    });
  }
}

export default new AuthController();