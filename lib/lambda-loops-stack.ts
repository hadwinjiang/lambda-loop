import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export class LambdaLoopsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // declare const alias: lambda.Alias;
    // const alarm = new cloudwatch.Alarm(this, 'Errors', {
    //   comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    //   threshold: 1,
    //   evaluationPeriods: 1,
    //   metric: alias.metricErrors(),
    // });

    // Creat SNS Topic
    const topicForQueue = new sns.Topic(this, 'TopicForQueue');

    // Create SQS
    const queue = new sqs.Queue(this, 'LoopsQueue', {
      // Trigger the lambda for every 60 seconds
      // visibilityTimeout: Duration.seconds(60)
      visibilityTimeout: Duration.seconds(60),
    });
    topicForQueue.addSubscription(new subs.SqsSubscription(queue));
    const sqsEventSource = new SqsEventSource(queue, {
      // Process one alert a time
      batchSize: 1
    });

    const topicForMail = new sns.Topic(this, 'TopicForMail');

    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchReadOnlyAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSNSFullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess")
    ]
    });

    const lambdaFunction = new lambda.Function(this, 'LogicHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('lambda_python'),
      handler: 'lambda.lambda_handler',
      role: lambdaRole,
      environment: {
        "arnOfMailSns": topicForMail.topicArn
      }
    });

    // arrange sqs to trigger lambda
    lambdaFunction.addEventSource(sqsEventSource);

  }
}
