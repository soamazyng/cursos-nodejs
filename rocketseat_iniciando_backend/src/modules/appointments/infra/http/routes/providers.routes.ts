import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersControllers from '../controllers/ProvidersControllers';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersControllers();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.list);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.list,
);
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.list,
);

export default providersRouter;
