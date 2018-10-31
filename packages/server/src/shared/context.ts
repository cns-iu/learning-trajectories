import * as BigQuery from '@google-cloud/bigquery';


export class GraphQLContext {
  db: BigQuery;
  constructor(bigQueryProjectId: string) {
    this.db = new BigQuery({projectId: bigQueryProjectId});
  }
}
