import path from 'path';
import fs from 'fs';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import UploadConfig from '../../../config/upload';

import IUsersRepository from '../repositories/IUsersRepository';

type Request = {
  user_id: string;
  avatarFilename: string;
};

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(UploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await this.repository.save(user);

    return user;
  }
}
