module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'configs',
      [
        {
          name: 'config_start_hour',
          key: '{"start_hour": "08:00", "end_hour": "18:00"}',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
