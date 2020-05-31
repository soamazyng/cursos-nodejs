import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type Request = {
  provider_id: string;
  day: number;
  month: number;
  year: number;
};

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private repository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: Request): Promise<Appointment[]> {
    const appointments = await this.repository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    return appointments;
  }
}
