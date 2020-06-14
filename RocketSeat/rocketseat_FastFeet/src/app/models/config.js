import Sequelize, { Model } from 'sequelize';

class Config extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        key: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }
}

export default Config;
