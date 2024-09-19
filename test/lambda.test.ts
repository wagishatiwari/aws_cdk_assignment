import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaStack } from '../lib/Lambda';

describe('Lambda Stack', () => {
    test('Lambda function is created with correct properties', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');

        // Create the Lambda stack
        const lambdaStack = new LambdaStack(stack, 'TestLambdaStack', {
            tableName: 'PersonTableTest',
            topicArn: 'arn:aws:sns:us-east-1:123456789012:PersonCreatedTopicTest',
        });

        // Create a CloudFormation template from the stack
        const template = Template.fromStack(lambdaStack);

        // Test if the Lambda function has been created
        template.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.createPersonHandler',
            Runtime: 'nodejs20.x',
            Environment: {
                Variables: {
                    PERSON_TABLE_NAME: 'PersonTableTest',
                    TOPIC_ARN: 'arn:aws:sns:us-east-1:123456789012:PersonCreatedTopicTest',
                },
            },
        });
    });
});