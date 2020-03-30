import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import DeliveryMan from '../app/models/deliveryMan';
import File from '../app/models/file';
import Recipient from '../app/models/recipient';
import User from '../app/models/user';
import Delivery from '../app/models/delivery';
import DeliveryProblems from '../app/models/deliveryProblems';
import Config from '../app/models/config';

const models = [
  User,
  Recipient,
  File,
  DeliveryMan,
  Delivery,
  Config,
  DeliveryProblems,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
