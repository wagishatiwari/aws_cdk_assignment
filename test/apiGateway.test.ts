import { App } from 'aws-cdk-lib';

import { ApiGatewayStack } from '../lib/ApiGateway';
import { Template } from 'aws-cdk-lib/assertions';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from 'aws-cdk-lib/aws-lambda';

test('API Gateway Created', () => {
    const app = new App();
    const lambdaFunction = new NodejsFunction(app, 'TestFunction', {
        runtime: Runtime.NODEJS_20_X,
        handler: 'createPersonHandler',
        environment: {
            HELLO_TABLE_NAME: 'tableName',
            TOPIC_ARN: 'topicArn'
        },
    });
    const stack = new ApiGatewayStack(app, 'TestStack', {
        lambdaFunction
    });
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {});
});