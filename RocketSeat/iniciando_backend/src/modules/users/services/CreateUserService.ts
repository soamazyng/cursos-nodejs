import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import IUsersRepository from '../repositories/IUsersRepository';

type Request = {
  name: string;
  email: string;
  password: string;
};

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,

    @inject('HashProvider') private hashProvider: IHashProvider,

    @inject('CacheProvider') private cacheRepository: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.repository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheRepository.invalidatePrefix('providers-list');

    return user;
  }
}
