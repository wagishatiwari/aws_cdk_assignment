import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DynamoDBStack } from '../lib/dynamoDB';

describe('DynamoDB Stack', () => {
    test('DynamoDB table is created with correct properties', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');

        // Create the DynamoDB stack
        const dynamoDBStack = new DynamoDBStack(stack, 'PersonTableTest');

        // Create a CloudFormation template from the stack
        const template = Template.fromStack(dynamoDBStack);

        // Test if the DynamoDB table has been created
        template.hasResourceProperties('AWS::DynamoDB::Table', {
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            TableName: 'PersonTableTest', // Replace with the actual table name from your config
        });
    });
});