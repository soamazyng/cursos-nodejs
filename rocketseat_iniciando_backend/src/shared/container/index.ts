import { container } from 'tsyringe';

// importo a interface
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// importo o repository
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
// importo a interface
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
// importo o repository
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
