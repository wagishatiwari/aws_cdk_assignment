import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBStack extends Stack {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this,id, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: id,
    });
  }
}