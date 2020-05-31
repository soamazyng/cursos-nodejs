import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '../CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  // executa antes de cada um dos testes
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointment = await createAppointmentService.execute({
      user_id: 'user-teste',
      date: new Date(2020, 4, 10, 12),
      provider_id: 'provider-teste',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-teste');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointmentDate = new Date(2020, 5, 10, 12);

    await createAppointmentService.execute({
      user_id: 'user-teste',
      date: appointmentDate,
      provider_id: 'provider-teste',
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-teste',
        date: appointmentDate,
        provider_id: 'provider-teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 10),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 10),
        user_id: 'user',
        provider_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 10, 7),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 10, 18),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
