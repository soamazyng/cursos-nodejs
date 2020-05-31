import { startOfHour, isBefore, getHours } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type Request = {
  user_id: string;
  provider_id: string;
  date: Date;
};

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private repository: IAppointmentsRepository,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You ca only create appointments between 8am and 5pm');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointments on a past date");
    }

    const findAppointmentInSameDate = await this.repository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.repository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}
