import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listProviderDatAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDatAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}
