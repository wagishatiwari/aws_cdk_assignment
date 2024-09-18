import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'dev';
const config = JSON.parse(fs.readFileSync(`./config.${env}.json`, 'utf8'));

export class SNSStack extends Stack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.topic = new sns.Topic(this, config.topicName);
  }
}