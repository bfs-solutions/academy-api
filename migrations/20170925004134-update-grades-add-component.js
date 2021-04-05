'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
	  return queryInterface.addColumn('grades', 'component', {
		  type: Sequelize.INTEGER,
		  references: { model: "components", key: "id"},
		  onUpdate: "CASCADE",
		  onDelete: "CASCADE"
	  });
  },

  down: function (queryInterface, Sequelize) {
	  return queryInterface.removeColumn('grades', 'component');
  }
};
