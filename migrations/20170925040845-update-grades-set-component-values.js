'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('SELECT * FROM evaluations')
        .then(function (evaluations) {
          // console.log('evaluations:', evaluations[0]);

          var promise = Promise.resolve();

          evaluations[0].forEach(function (evaluation) {
            if(evaluation.component === null || evaluation.component === undefined){
              return;
            }

            var query = 'UPDATE grades SET component = ' + evaluation.component + ' WHERE evaluation = ' + evaluation.id;

            console.log('query:', query);

            promise = promise.then(function () {
				return queryInterface.sequelize.query(query);
			})
		  });

		  // return Promise.all(evaluations.map(function (evaluation) {
           //    return queryInterface.query(
           //        'UPDATE grades SET component = ' + evaluation.component + ' WHERE evaluation = ' + evaluation.id
           //    );
		  // }))

          return promise;
        })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
