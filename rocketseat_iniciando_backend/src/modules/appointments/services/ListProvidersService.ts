import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

type Request = {
  user_id: string;
};

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    const users = await this.repository.findAllProviders({
      except_user_id: user_id,
    });

    return users;
  }
}
