
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'name');
  }
};
