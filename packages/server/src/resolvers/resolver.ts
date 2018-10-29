// import * as bigQueryModule from '../shared/BigQuery';

// import { Query } from '../shared/BigQuery';

// const resolver = {
//     Query: {
//         nodes: (root, args, context) => queryOptions('*', '`bl-sice-edx-la-visualizations.learning_trajectories.course_modules`',
//                                                              '1=1'),
//         /*edges: (root, args, context) => {return transition_data;},
//         courses: (root, args, context) => {return course_data;},
//         personMetaData: (root, args, context) => {return student_data;},*/

//     }
// };

// async function queryOptions(columns, tableName, whereCondition) {
//     const x =  await new Query(columns, tableName, whereCondition).runQuery();
//     return x[0];
// }
// module.exports = {resolver};

import { BigQueryBuilder } from '../shared/BigQueryBuilder';
import { GQResolver } from '../interfaces/GraphQueryResolver'

export class Resolver {

    resolver: GQResolver;
    constructor() {
        this.resolver = {
            Query: {
                nodes: (root, args, context) => this.queryOptions('*',
                '`bl-sice-edx-la-visualizations.learning_trajectories.course_modules`', '1=1'),
             }
        };
    }

    async queryOptions(columns, tableName, whereCondition): Promise<any> {
       const x =  await new BigQueryBuilder(columns, tableName, whereCondition).runQuery();
           return x[0];
    }

    getResolverMap(): GQResolver {
        return this.resolver;
    }

}
