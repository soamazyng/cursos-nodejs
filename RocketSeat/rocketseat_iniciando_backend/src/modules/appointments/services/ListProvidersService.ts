import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

type Request = {
  user_id: string;
};

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
    @inject('CacheProvider') private cacheRepository: ICacheProvider,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    let users = await this.cacheRepository.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.repository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheRepository.save(`providers-list:${user_id}`, users);
    }

    return users;
  }
}
