import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import * as fs from 'fs';

import {DynamoDBStack} from "./dynamoDB";
import {SNSStack} from "./SnsStack";
import {LambdaStack} from "./Lambda";
import {ApiGatewayStack} from "./ApiGateway";

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

export class AssignmentStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const dynamoDBStack = new DynamoDBStack(this, config.tableName);
        const snsStack = new SNSStack(this, config.topicName);


        const lambdaStack = new LambdaStack(this, config.lambdaName, {
            tableName: dynamoDBStack.table.tableName,
            topicArn: snsStack.topic.topicArn
        });
        dynamoDBStack.table.grantReadWriteData(lambdaStack.lambdaFunction);
        snsStack.topic.grantPublish(lambdaStack.lambdaFunction);

        const snsInvokePolicy = new iam.PolicyStatement({
            actions: ['sns:Publish'],
            resources: [snsStack.topic.topicArn],
        });
        lambdaStack.lambdaFunction.addToRolePolicy(snsInvokePolicy);


        const apiGatewayStack = new ApiGatewayStack(this, config.apiName, {
            lambdaFunction: lambdaStack.lambdaFunction
        });
    }

}

