const BigQuery = require('@google-cloud/bigquery');

export class BigQueryBuilder {
    private query: string;
    private projectId = 'bl-sice-edx-la-visualizations';
    private columns: string;
    private tableName: string;
    private whereCondition: string;
    private bigquery: any;
    constructor(columns: string, tableName: string, whereCondition: string) {
        this.columns = columns;
        this.whereCondition = whereCondition;
        this.tableName = tableName;
        this.query = `
        SELECT ${this.columns} FROM ${this.tableName} WHERE ${this.whereCondition}
        `;
        this.bigquery = new BigQuery({'projectId': this.projectId});
    }

    runQuery() {
        console.log(this.query);
        return this.bigquery.query({'query': this.query, 'useLegacySql': false});
    }
}
