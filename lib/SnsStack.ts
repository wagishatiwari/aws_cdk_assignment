import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';

export class SNSStack extends Stack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.topic = new sns.Topic(this, id, {
        topicName: id,
    });
  }
}