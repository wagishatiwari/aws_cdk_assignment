import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SNSStack } from '../lib/SnsStack';

describe('SNS Stack', () => {
    test('SNS topic is created with correct properties', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');

        // Create the SNS stack
        const snsStack = new SNSStack(stack, 'PersonCreatedTopicTest');

        // Create a CloudFormation template from the stack
        const template = Template.fromStack(snsStack);

        // Test if the SNS topic has been created
        template.hasResourceProperties('AWS::SNS::Topic', {
            TopicName: 'PersonCreatedTopicTest',
        });
    });
});