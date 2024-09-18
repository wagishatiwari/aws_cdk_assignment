import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

export class DynamoDBStack extends Stack {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, config.tableName, {
      partitionKey: { name: 'id', type: AttributeType.STRING }
    });
  }
}