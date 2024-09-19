import { Stack } from 'aws-cdk-lib';
import * as fs from 'fs';

import { App } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import {DynamoDBStack} from "../lib/dynamoDB";
import {SNSStack} from "../lib/SnsStack";
import {LambdaStack} from "../lib/Lambda";
import {ApiGatewayStack} from "../lib/ApiGateway";

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

describe('API Gateway Stack', () => {
    test('API Gateway is created with correct properties', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');

        // Create the DynamoDB stack
        const dynamoDBStack = new DynamoDBStack(stack, 'PersonTableTest');

        // Create the SNS stack
        const snsStack = new SNSStack(stack, 'PersonCreatedTopicTest');

        // Create the Lambda stack
        const lambdaStack = new LambdaStack(stack, 'CreatePersonLambdaTest', {
            tableName: dynamoDBStack.table.tableName,
            topicArn: snsStack.topic.topicArn,
        });

        // Create the API Gateway stack
        const apiGatewayStack = new ApiGatewayStack(stack, 'PersonApiGatewayTest', {
            lambdaFunction: lambdaStack.lambdaFunction,
        });

        // Create a CloudFormation template from the stack
        const template = Template.fromStack(apiGatewayStack);

        // Test if the API Gateway has been created
        template.hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'PersonApiGatewayTest',
        });
    });
});



