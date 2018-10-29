import * as bigQueryModule from '../shared/BigQuery';

const resolver = {
    Query: {
        nodes: async (root, args, context) => {const x =  await bigQueryModule.getFromSelectQuery('dsd'); return x[0]; },
        /*edges: (root, args, context) => {return transition_data;},
        courses: (root, args, context) => {return course_data;},
        personMetaData: (root, args, context) => {return student_data;},*/

    }
};

module.exports = {resolver};
