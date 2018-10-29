const BigQuery = require('@google-cloud/bigquery');

const projectId = 'bl-sice-edx-la-visualizations';
const bigquery = new BigQuery({projectId});

const sqlQuery = 'SELECT * FROM `bl-sice-edx-la-visualizations.learning_trajectories.course_modules`';

export function getFromSelectQuery(query) {

    const options = {
        query: sqlQuery,
        useLegacySql: false,
      };
      return bigquery.query(options);
}

module.exports = {getFromSelectQuery};
