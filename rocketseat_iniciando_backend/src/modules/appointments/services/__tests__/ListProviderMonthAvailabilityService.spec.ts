import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  // executa antes de cada um dos testes
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the mounth availability from provider', async () => {
    const hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    Promise.all(
      await hour.map(h => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider-teste',
          user_id: 'user-teste',
          date: new Date(2020, 4, 20, h, 0, 0),
        });
      }),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-teste',
      user_id: 'user-teste',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider-teste',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
