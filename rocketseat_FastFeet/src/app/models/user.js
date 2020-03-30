import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      { sequelize }
    );

    // antes de salvar ele cria uma hash no campo senha
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this; // retorna o static init para a model
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
