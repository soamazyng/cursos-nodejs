import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

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
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheRepository.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.repository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheRepository.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}
