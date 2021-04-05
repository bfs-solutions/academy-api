'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('students', 'father_email', {
          type: Sequelize.STRING
      }).then(function () {
          return queryInterface.addColumn('students', 'mother_email', {
              type: Sequelize.STRING
          })
      }).then(function () {
          return queryInterface.addColumn('students', 'legal_guardian_email', {
              type: Sequelize.STRING
          })
      });
  },

  down: function (queryInterface, Sequelize) {
	  return queryInterface.removeColumn('students', 'legal_guardian_email')
          .then(function () {
              return queryInterface.removeColumn('students', 'mother_email');
		  })
		  .then(function () {
			  return queryInterface.removeColumn('students', 'father_email');
		  });
  }
};
