
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('subjects', 'qualitative', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
      });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('subjects', 'qualitative');
  }
};
