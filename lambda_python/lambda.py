import os
import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(os.environ)
    logger.info(json.dumps(event))

    cloudwatch = boto3.resource('cloudwatch')
    sns = boto3.resource('sns')
    # topic = sns.Topic('arn:aws:sns:region-code:account-id:my-poc-sendAlarm')
    # topic = sns.Topic('arn:aws:sns:ap-northeast-1:397684039306:LambdaLoopsStack-TopicForMailDC16672E-oMfbA4S930pp')
    topic = sns.Topic(os.environ['arnOfMailSns'])

    sqsRecord = event['Records'][0]
    body = json.loads(sqsRecord['body'])
    message = json.loads(body['Message'])
    alarmName = message['AlarmName']
    
    alarm = cloudwatch.Alarm(alarmName)
    alarmStateValue = alarm.state_value
    alarmStateReason = alarm.state_reason

    publishMessage = {}
    publishMessage['AlarmName'] = alarmName
    publishMessage['AlarmState'] = alarmStateValue
    publishMessage['AlarmStateDetail'] = alarmStateReason
    
    topic.publish(
        Message=str(publishMessage)
    )
   
    if alarmStateValue == 'ALARM':
        raise Exception("This alarm still exists!!!")