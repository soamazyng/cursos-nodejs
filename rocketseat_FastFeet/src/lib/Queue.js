import Bee from 'bee-queue';

import l from '../config/logger';
import redisConfig from '../config/redis';
import DeliveryMail from '../app/jobs/deliveryMail';
import CancelDeliveryMail from '../app/jobs/cancelDeliveryMail';

const jobs = [DeliveryMail, CancelDeliveryMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    l.error(`Queue ${job.queue.name}: FAILED ${err}`);
  }
}

export default new Queue();
