'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.renameColumn('enrollments', 'comming_from', 'institution');
  },

  down: function (queryInterface) {
      return queryInterface.renameColumn('enrollments', 'institution', 'comming_from');
  }
};
