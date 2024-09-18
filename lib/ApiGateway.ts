import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

interface ApiGatewayStackProps extends StackProps {
  lambdaFunction: NodejsFunction;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new apigateway.LambdaRestApi(this, config.apiName, {
      handler: props.lambdaFunction,
      proxy: false,
    });

    const personsResource = api.root.addResource('persons');
    const createPersonIntegration = new apigateway.LambdaIntegration(props.lambdaFunction);

    personsResource.addMethod('POST', createPersonIntegration);
    personsResource.addMethod('GET', createPersonIntegration);
  }
}