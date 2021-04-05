'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('enrollments', 'observations', {
        type: Sequelize.TEXT
    })
  },

  down: function (queryInterface, Sequelize) {
	  return queryInterface.removeColumn('enrollments', 'observations');
  }
};
