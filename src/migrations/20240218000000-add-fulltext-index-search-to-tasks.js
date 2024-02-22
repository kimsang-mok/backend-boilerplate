module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE tasks ADD FULLTEXT(title, description)"
    );
  },

  down: async (queryInterface, sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE tasks DROP FULLTEXT(title, description"
    );
  }
};
