import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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
    @inject('CacheProvider')
    private cacheRepository: ICacheProvider,
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

    await this.cacheRepository.save('asd', 'asd');

    return appointments;
  }
}
