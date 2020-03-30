import { Router } from 'express';

import multer from 'multer';

import multerConfig from './config/multer';
import AuthController from './app/controllers/authController';
import DeliveryController from './app/controllers/deliveryController';
import DeliveryManController from './app/controllers/deliveryManController';
import DeliveryProblemsController from './app/controllers/deliveryProblemsController';
import FileController from './app/controllers/fileController';
import RecipientController from './app/controllers/recipientController';
import UserController from './app/controllers/userController';
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/signin', AuthController.signin);

// rotas do entregador
routes.get(
  '/deliveries-man/:id/deliveries',
  DeliveryController.getDeliveriesByDeliveryMan
);
routes.get(
  '/deliveries-man/:id/delivery',
  DeliveryController.getDeliveryByDeliveryMan
);
routes.put(
  '/deliveries-man/:id/start-delivery',
  DeliveryController.startDeliveryStore
);
routes.put(
  '/deliveries-man/:id/end-delivery',
  DeliveryController.endDeliveryStore
);

routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

// rotas da distribuidora
routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

// recipients routes
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.get);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// file upload
routes.post('/files', upload.single('file'), FileController.store);

// DeliveryMan routes
routes.get('/deliveries-man', DeliveryManController.index);
routes.get('/deliveries-man/:id', DeliveryManController.get);
routes.post('/deliveries-man', DeliveryManController.store);
routes.put('/deliveries-man/:id', DeliveryManController.update);
routes.delete('/deliveries-man/:id', DeliveryManController.delete);

// Delivery routes
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.get);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Delivery Problems
routes.get('/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.get);
routes.delete(
  '/problem/:id/cancel-delivery',
  DeliveryProblemsController.cancelDelivery
);

export default routes;
