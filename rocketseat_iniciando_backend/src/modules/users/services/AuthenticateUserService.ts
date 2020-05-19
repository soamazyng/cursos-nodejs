import { compare } from 'bcryptjs';

import { injectable, inject } from 'tsyringe';

import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';

import IUsersRepository from '../repositories/IUsersRepository';

type Request = {
  email: string;
  password: string;
};

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
  ) {}

  public async execute({
    email,
    password,
  }: Request): Promise<{ user: User; token: string }> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
