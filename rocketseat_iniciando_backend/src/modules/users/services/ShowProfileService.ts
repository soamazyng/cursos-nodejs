import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

type Request = {
  user_id: string;
};

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 401);
    }

    return user;
  }
}
