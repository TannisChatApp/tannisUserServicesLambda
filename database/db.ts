import { DynamoDB } from 'aws-sdk';
import { dynamoDbTannisUserEntry } from '../interfaces/databaseData';
import { StdQueryObj } from '../interfaces/requestBodyData';
import { User } from '../models/userModel';

export class DB {
    private static singleReference: (null|DB) = null;
    private readonly dynamoDB: DynamoDB.DocumentClient;
    private readonly tableName: string;
    private readonly tableIndexes: string[];

    private constructor () {
        this.dynamoDB = new DynamoDB.DocumentClient({
            region: "ap-south-1"
        });
        this.tableName = "tannisUsers";
        this.tableIndexes = [
            "u_id-index",
            "sl_no-u_eml-index"
        ];
    }

    private setCommonOptsForScanAndQueryTasks (queryObj: StdQueryObj, indexChoice: number): object {
        let docRequestParams: any = {
            TableName: this.tableName,
            ProjectionExpression: queryObj.col_patt,
            ExpressionAttributeValues: queryObj.cond_attrs_obj
        };
        if (indexChoice !== undefined) { docRequestParams['IndexName'] = this.tableIndexes[indexChoice]; }
        return docRequestParams;
    }

    public async runScan (queryObj: StdQueryObj, indexChoice: number): Promise<dynamoDbTannisUserEntry[]|Error> {
        let docRequestParams: any = this.setCommonOptsForScanAndQueryTasks(queryObj, indexChoice);
        docRequestParams['FilterExpression'] = queryObj.cond;
        let result: (dynamoDbTannisUserEntry[]|Error) = [];
        await this.dynamoDB.scan(docRequestParams).promise()
        .then((data: any) => { console.log(data); result = data.Items; })
        .catch((err: Error) => { console.log(err); result = err; })
        .finally(() => { console.log(docRequestParams); console.log(queryObj); console.log(indexChoice); });
        return (result);
    }

    public async runQuery (queryObj: StdQueryObj, indexChoice: number): Promise<dynamoDbTannisUserEntry[]|Error> {
        let docRequestParams: any = this.setCommonOptsForScanAndQueryTasks(queryObj, indexChoice);
        docRequestParams['KeyConditionExpression'] = queryObj.cond;
        let result: (dynamoDbTannisUserEntry[]|Error) = [];
        await this.dynamoDB.query(docRequestParams).promise()
        .then((data: any) => { console.log(data); result = data.Items; })
        .catch((err: Error) => { console.log(err); result = err; })
        .finally(() => { console.log(docRequestParams); console.log(queryObj); console.log(indexChoice); });
        return (result);
    }

    public async runPutItem (user: User): Promise<any> {
        let docRequestParams: any = {
            TableName: this.tableName,
            Item: user.getDBJsonItem()
        };
        let result: any = {};
        await this.dynamoDB.put(docRequestParams).promise()
        .then((data: any) => { console.log(data); result = data; })
        .catch((err: Error) => { console.log(err); result = err; })
        .finally(() => { console.log(docRequestParams); });
        return (result);
    }

    public static getDBInstance (): DB { 
        if (DB.singleReference === null) { DB.singleReference = new DB(); }
        return (DB.singleReference);
    }
}