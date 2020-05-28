import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const userController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', userController.create);

// patch faz a atualização de um único campo
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.create,
);

export default usersRouter;
