export class BigQueryBuilder {
  private query: string;
  private columns: string;
  private tableName: string;
  private whereCondition: string;

  constructor(columns: string, tableName: string, whereCondition: string, private bigquery: any) {
    this.columns = columns;
    this.whereCondition = whereCondition;
    this.tableName = tableName;
    this.query = `
      SELECT ${this.columns} FROM ${this.tableName} WHERE ${this.whereCondition}
    `;
  }

  runQuery(params?: any) {
    console.log(this.query);
    return this.bigquery.query({ 'query': this.query, 'useLegacySql': false, params });
  }
}
