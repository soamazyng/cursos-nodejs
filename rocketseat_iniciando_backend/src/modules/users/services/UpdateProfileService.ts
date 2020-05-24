import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

type Request = {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
};

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email }: Request): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    user.name = name;
    user.email = email;

    return this.repository.save(user);
  }
}
