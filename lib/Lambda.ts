import { Construct } from 'constructs';
import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {FunctionUrlAuthType, Runtime} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

interface LambdaStackProps extends StackProps {
  tableName: string;
  topicArn: string;
}

export class LambdaStack extends Stack {
  public readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.lambdaFunction = new NodejsFunction(this, config.lambdaName, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, `/../functions/PersonService.ts`),
      handler: 'createPersonHandler',
      environment: {
        PERSON_TABLE_NAME: props.tableName,
        TOPIC_ARN: props.topicArn
      },
    });

    const myFunctionUrl = this.lambdaFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      }
    });
    new CfnOutput(this, 'FunctionUrl', {
      value: myFunctionUrl.url,
    });
  }


}

