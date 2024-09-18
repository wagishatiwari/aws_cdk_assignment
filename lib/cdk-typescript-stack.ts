import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import {Runtime, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as fs from 'fs';

import * as path from 'path';
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";
const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));
import {DynamoDBStack} from "./dynamoDB";
import {SNSStack} from "./SnsStack";
import {LambdaStack} from "./Lambda";
import {ApiGatewayStack} from "./ApiGateway";

export class CdkTypescriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

   /* const table = new Table(this, config.tableName, {
      partitionKey: { name: 'id', type: AttributeType.STRING }
    });*/
      const dynamoDBStack = new DynamoDBStack(this, config.tableName);
    const snsStack = new SNSStack(this, config.topicName);

      //const topic = new sns.Topic(this, config.topicName);

    /*const lamdaFn = new NodejsFunction(this, config.lambdaName, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, `/../functions/function.ts`),
      handler: "createPersonHandler",
      environment: {
        HELLO_TABLE_NAME: DynamoDB.tableName,
        TOPIC_ARN: topic.topicArn
      },
    });*/

    const lambdaStack = new LambdaStack(this, config.lambdaName, {
      tableName: dynamoDBStack.table.tableName,
      topicArn: snsStack.topic.topicArn
    });
    dynamoDBStack.table.grantReadWriteData(lambdaStack.lambdaFunction);
    snsStack.topic.grantPublish(lambdaStack.lambdaFunction);

    // permissions to lambda to dynamo table
    /*table.grantReadWriteData(lamdaFn);
    topic.grantPublish(lamdaFn)*/
      /*const snsInvokePolicy = new iam.PolicyStatement({
          actions: ['sns:Publish'],
          resources: [topic.topicArn],
      });*/
    const snsInvokePolicy = new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: [snsStack.topic.topicArn],
    });
    lambdaStack.lambdaFunction.addToRolePolicy(snsInvokePolicy);


    // lamdaFn.addToRolePolicy(snsInvokePolicy);

   /* const myFunctionUrl = lamdaFn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      }
    });*/
    const apiGatewayStack = new ApiGatewayStack(this, config.apiName, {
      lambdaFunction: lambdaStack.lambdaFunction
    });

  /*  const api = new apigateway.LambdaRestApi(this, config.apiName, {
      handler: lamdaFn,
      proxy: false,
    });

    const apiGatewayStack = new ApiGatewayStack(this, 'ApiGatewayStack', {
      lambdaFunction: lambdaStack.lambdaFunction
    });
*/
    /*const personsResource = api.root.addResource('persons');
    const createPersonIntegration = new apigateway.LambdaIntegration(lamdaFn);

    personsResource.addMethod('POST',createPersonIntegration);
    personsResource.addMethod('GET',createPersonIntegration);*/

/*
    new CfnOutput(this, 'FunctionUrl', {
      value: myFunctionUrl.url,
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });*/

  }
}
//1. refactore code to put resources into their own files
//2. add enviroment variable to dev and prod.