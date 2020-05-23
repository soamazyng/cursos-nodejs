import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

// importo a interface
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// importo o repository
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
